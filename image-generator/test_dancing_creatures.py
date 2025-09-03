#!/usr/bin/env python3
"""
Test Notice Board Generator - Dancing Creatures
Single project test using Google's Imagen 4 with OCR verification.
"""

import json
import os
import time
import re
from pathlib import Path
from PIL import Image
import pytesseract
from google import genai
from google.genai import types
from difflib import SequenceMatcher

def clean_text_for_comparison(text):
    """Clean text for comparison by removing extra whitespace and normalizing."""
    text = re.sub(r'\s+', ' ', text.strip().lower())
    text = re.sub(r'[^\w\s\-\.\,\!\?]', '', text)
    return text

def similarity_score(text1, text2):
    """Calculate similarity between two text strings."""
    clean1 = clean_text_for_comparison(text1)
    clean2 = clean_text_for_comparison(text2)
    return SequenceMatcher(None, clean1, clean2).ratio()

def load_dancing_creatures_project():
    """Load just the Dancing Creatures project from JSON file."""
    with open('../data/projects.json', 'r') as f:
        data = json.load(f)
    
    # Find Dancing Creatures project
    for project in data['projects']:
        if project['title'] == "Dancing Creatures":
            return project
    
    raise ValueError("Dancing Creatures project not found!")

def format_project_text(project):
    """Format project information for the notice board."""
    title = project['title']
    date = project['date']
    description = project['description']  # No truncation - use full description
    
    # Simple, clean format without headers, links, or tags
    full_text = f"""{title}
{date}
{description}"""
    
    return full_text

def generate_imagen_prompt(project):
    """Generate a detailed prompt for Imagen 4 including the project text."""
    project_text = format_project_text(project)
    
    prompt = f"""A photograph of a lined piece of notebook paper pinned to a cork notice board. The camera angle is perpendicular to the notice board, no tilt. The piece of paper takes up most of the image and has the following text written on it in neat, legible handwriting with a pen:

{project_text}

The handwriting should be clear, consistent, and easy to read. The text should follow the lines of the notebook paper. The pin is visible at the top. Realistic lighting and shadows. High quality photograph."""
    
    return prompt, project_text

def generate_image_imagen4(project, output_path, base_dir, max_retries=10):
    """Generate image using Google's Imagen 4 with comprehensive OCR verification and logging."""
    
    # Storage for all attempts
    all_attempts = []
    project_name = project['title'].replace(' ', '_').lower()
    
    try:
        # Initialize Google Gen AI client for Vertex AI
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
        location = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
        
        if not project_id:
            print("❌ GOOGLE_CLOUD_PROJECT_ID not set. Please set your Google Cloud project ID.")
            print("Run: export GOOGLE_CLOUD_PROJECT_ID='image-generator-web-page'")
            return False, None, all_attempts
            
        client = genai.Client(vertexai=True, project=project_id, location=location)
        
        prompt, expected_text = generate_imagen_prompt(project)
        
        print(f"🎨 Generated prompt:")
        print(f"   {prompt[:100]}...")
        print(f"📝 Expected text:")
        print(f"   {expected_text[:100]}...")
        
        for attempt in range(max_retries):
            print(f"\n🎨 Generation attempt {attempt + 1}/{max_retries}")
            attempt_data = {
                'attempt': attempt + 1,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'success': False,
                'error': None,
                'similarity': 0.0,
                'ocr_text': '',
                'enhanced_prompt': '',
                'image_path': '',
                'ocr_result_path': ''
            }
            
            try:
                # Generate image with Imagen 4
                response = client.models.generate_images(
                    model="imagen-4.0-ultra-generate-preview-06-06", #"imagen-4.0-generate-preview-06-06",
                    prompt=prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        aspect_ratio="1:1",
                        image_size="2K",
                        enhance_prompt=True,  # Let Imagen 4 enhance our prompt for better results
                        safety_filter_level="BLOCK_MEDIUM_AND_ABOVE",
                        person_generation="DONT_ALLOW",
                        add_watermark=True
                    ),
                )
                
                # Save the generated image for this attempt
                if response.generated_images:
                    generated_image = response.generated_images[0]
                    pil_image = generated_image.image._pil_image
                    
                    # Convert to RGB if needed
                    if pil_image.mode != "RGB":
                        pil_image = pil_image.convert("RGB")
                    
                    # Save this attempt
                    attempt_image_path = f"{base_dir}/all_attempts/{project_name}_attempt_{attempt + 1}.png"
                    pil_image.save(attempt_image_path)
                    attempt_data['image_path'] = attempt_image_path
                    
                    print(f"✅ Image generated and saved: {attempt_image_path}")
                    
                    # Store enhanced prompt if available
                    if hasattr(generated_image, 'enhanced_prompt') and generated_image.enhanced_prompt:
                        attempt_data['enhanced_prompt'] = generated_image.enhanced_prompt
                        print(f"🔧 Enhanced prompt: {generated_image.enhanced_prompt[:100]}...")
                    
                    # OCR verification
                    try:
                        ocr_text = pytesseract.image_to_string(pil_image)
                        attempt_data['ocr_text'] = ocr_text
                            
                        similarity = similarity_score(expected_text, ocr_text)
                        attempt_data['similarity'] = similarity
                        print(f"📊 Text similarity: {similarity:.2%}")
                        
                        # Save OCR results for this attempt
                        ocr_result_path = f"{base_dir}/ocr_results/{project_name}_attempt_{attempt + 1}_ocr.txt"
                        attempt_data['ocr_result_path'] = ocr_result_path
                        
                        with open(ocr_result_path, 'w') as f:
                            f.write(f"Project: {project['title']}\n")
                            f.write(f"Attempt: {attempt + 1}\n")
                            f.write(f"Timestamp: {attempt_data['timestamp']}\n")
                            f.write(f"Similarity Score: {similarity:.2%}\n")
                            f.write(f"Success: {'Yes' if similarity >= 0.6 else 'No'}\n")
                            f.write(f"\n--- Original Prompt ---\n{prompt}\n")
                            if attempt_data['enhanced_prompt']:
                                f.write(f"\n--- Enhanced Prompt ---\n{attempt_data['enhanced_prompt']}\n")
                            f.write(f"\n--- Expected Text ---\n{expected_text}\n")
                            f.write(f"\n--- OCR Result ---\n{ocr_text}\n")
                        
                        print(f"📄 OCR results saved: {ocr_result_path}")
                        
                        if similarity >= 0.6:  # Lower threshold for testing
                            print(f"✅ Text verification passed!")
                            print(f"📝 OCR detected: {ocr_text[:100]}...")
                            attempt_data['success'] = True
                            
                            # Copy successful image to final location
                            pil_image.save(output_path)
                            print(f"🎉 Final successful image saved: {output_path}")
                            
                            all_attempts.append(attempt_data)
                            return True, ocr_text, all_attempts
                        else:
                            print(f"❌ Text similarity too low ({similarity:.2%} < 60%)")
                            print(f"Expected: {expected_text[:80]}...")
                            print(f"Got: {ocr_text[:80]}...")
                            
                            if attempt < max_retries - 1:
                                print(f"🔄 Retrying...")
                                time.sleep(2)
                    
                    except Exception as ocr_error:
                        attempt_data['error'] = f"OCR error: {str(ocr_error)}"
                        print(f"❌ OCR error: {ocr_error}")
                        if attempt < max_retries - 1:
                            print(f"🔄 Retrying...")
            
            except Exception as gen_error:
                attempt_data['error'] = f"Generation error: {str(gen_error)}"
                print(f"❌ Generation error: {gen_error}")
                if attempt < max_retries - 1:
                    print(f"🔄 Retrying...")
                    time.sleep(2)
            
            # Store this attempt's data
            all_attempts.append(attempt_data)
        
        print(f"❌ Failed after {max_retries} attempts")
        return False, None, all_attempts
        
    except Exception as e:
        print(f"❌ Error with Imagen 4: {e}")
        return False, None, all_attempts

def downscale_with_jpeg(input_path, output_path, quality=85):
    """Downscale image to 50% and compress with JPEG."""
    try:
        with Image.open(input_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            new_width = img.width // 2
            new_height = img.height // 2
            img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            img_resized.save(
                output_path, 
                'JPEG', 
                quality=quality, 
                optimize=True,
                progressive=True
            )
            print(f"✅ Downscaled and compressed: {output_path}")
            return True
            
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return False

def create_test_directories():
    """Create unique test directories with timestamp."""
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    base_dir = f"test_results/run_{timestamp}"
    
    directories = [
        f'{base_dir}/original',
        f'{base_dir}/compressed',
        f'{base_dir}/all_attempts',
        f'{base_dir}/ocr_results'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")
    
    return base_dir

def main():
    """Test with Dancing Creatures project."""
    print("🎨 Testing Notice Board Generator with Dancing Creatures")
    print("🚀 Using Google Imagen 4 + OCR Verification")
    print("=" * 60)
    
    # Check dependencies
    try:
        import pytesseract
        from google import genai
        from google.genai import types
        print("✅ All dependencies available")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install: uv add pytesseract google-genai")
        return
    
    # Create test directories
    base_dir = create_test_directories()
    
    # Load Dancing Creatures project
    try:
        project = load_dancing_creatures_project()
        print(f"📋 Loaded project: {project['title']}")
    except Exception as e:
        print(f"❌ Error loading project: {e}")
        return
    
    # Check for required environment variables
    if not os.getenv('GOOGLE_CLOUD_PROJECT_ID'):
        print(f"\n⚠️  SETUP REQUIRED:")
        print(f"Missing GOOGLE_CLOUD_PROJECT_ID environment variable")
        print(f"\nSetup steps:")
        print(f"1. gcloud config set project image-generator-web-page")
        print(f"2. gcloud services enable aiplatform.googleapis.com")
        print(f"3. gcloud auth application-default login")
        print(f"4. export GOOGLE_CLOUD_PROJECT_ID='image-generator-web-page'")
        print(f"5. export GOOGLE_CLOUD_LOCATION='us-central1'  # Optional, defaults to us-central1")
        return
    
    # Generate test image
    original_path = f"{base_dir}/original/dancing_creatures.png"
    compressed_path = f"{base_dir}/compressed/dancing_creatures.jpg"
    
    print(f"\n🔄 Processing: {project['title']}")
    print(f"📁 Test run directory: {base_dir}")
    
    # Generate image with text
    success, ocr_text, all_attempts = generate_image_imagen4(project, original_path, base_dir)
    
    # Create comprehensive summary of all attempts
    summary_path = f"{base_dir}/{project['title'].replace(' ', '_').lower()}_comprehensive_summary.txt"
    with open(summary_path, 'w') as f:
        f.write(f"🎨 COMPREHENSIVE TEST RESULTS\n")
        f.write(f"=" * 50 + "\n")
        f.write(f"Project: {project['title']}\n")
        f.write(f"Test Date: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total Attempts: {len(all_attempts)}\n")
        f.write(f"Final Success: {'✅ Yes' if success else '❌ No'}\n\n")
        
        if success:
            successful_attempts = [a for a in all_attempts if a['success']]
            f.write(f"Successful Attempts: {len(successful_attempts)}\n")
            f.write(f"Success Rate: {len(successful_attempts)/len(all_attempts)*100:.1f}%\n\n")
        
        f.write(f"ATTEMPT DETAILS:\n")
        f.write(f"-" * 30 + "\n")
        
        for attempt in all_attempts:
            f.write(f"\n🔄 Attempt {attempt['attempt']} - {attempt['timestamp']}\n")
            f.write(f"Status: {'✅ SUCCESS' if attempt['success'] else '❌ FAILED'}\n")
            f.write(f"Similarity Score: {attempt['similarity']:.2%}\n")
            f.write(f"Image Saved: {attempt['image_path']}\n")
            f.write(f"OCR Result File: {attempt['ocr_result_path']}\n")
            
            if attempt['error']:
                f.write(f"Error: {attempt['error']}\n")
            
            if attempt['enhanced_prompt']:
                f.write(f"Enhanced Prompt: {attempt['enhanced_prompt'][:200]}...\n")
            
            if attempt['ocr_text']:
                f.write(f"OCR Preview: {attempt['ocr_text'][:100]}...\n")
            
            f.write(f"-" * 30 + "\n")
        
        # Statistics
        similarities = [a['similarity'] for a in all_attempts if a['similarity'] > 0]
        if similarities:
            f.write(f"\n📊 STATISTICS:\n")
            f.write(f"Average Similarity: {sum(similarities)/len(similarities):.2%}\n")
            f.write(f"Best Similarity: {max(similarities):.2%}\n")
            f.write(f"Worst Similarity: {min(similarities):.2%}\n")
        
        f.write(f"\n📁 ALL FILES GENERATED:\n")
        for attempt in all_attempts:
            if attempt['image_path']:
                f.write(f"  - {attempt['image_path']}\n")
            if attempt['ocr_result_path']:
                f.write(f"  - {attempt['ocr_result_path']}\n")
    
    print(f"\n📋 Comprehensive summary saved: {summary_path}")
    
    if success:
        print(f"🎉 Generation successful!")
        
        # Downscale and compress the final successful image
        if downscale_with_jpeg(original_path, compressed_path):
            print(f"✅ Test complete!")
            print(f"📁 Final successful image: {original_path}")
            print(f"📁 Compressed version: {compressed_path}")
        else:
            print(f"⚠️  Generation successful but compression failed")
    else:
        print(f"❌ Test failed - could not generate acceptable image")
        print(f"💡 This is normal for experimental text generation!")
    
    # Print summary of what was saved
    print(f"\n📊 COMPREHENSIVE RESULTS SUMMARY:")
    print(f"   🎯 Total attempts: {len(all_attempts)}")
    print(f"   📸 Images saved: {len([a for a in all_attempts if a['image_path']])}")
    print(f"   📄 OCR results: {len([a for a in all_attempts if a['ocr_result_path']])}")
    print(f"   ✅ Successful attempts: {len([a for a in all_attempts if a['success']])}")
    
    similarities = [a['similarity'] for a in all_attempts if a['similarity'] > 0]
    if similarities:
        print(f"   📊 Average similarity: {sum(similarities)/len(similarities):.2%}")
        print(f"   🏆 Best similarity: {max(similarities):.2%}")
    
    print(f"\n📁 All files saved in: {base_dir}/")
    print(f"   📂 all_attempts/ - Every generated image")
    print(f"   📂 ocr_results/ - Individual OCR analysis for each attempt")
    print(f"   📄 comprehensive_summary.txt - Complete test overview")
    print(f"   🕒 Test run timestamp: {base_dir.split('_')[-1]}")

if __name__ == "__main__":
    main() 