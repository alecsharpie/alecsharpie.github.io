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
    # Keep description shorter for better generation
    description = project['description'][:150] + "..." if len(project['description']) > 150 else project['description']
    
    # Format links simply
    links_text = ""
    for link_name, url in project['links'].items():
        links_text += f"{link_name}: {url}\n"
    
    # Format tags
    tags_text = " ".join([f"#{tag}" for tag in project.get('tags', [])])
    
    full_text = f"""Title: {title}
Date: {date}
Description: {description}
Links:
{links_text.strip()}
Tags: {tags_text}"""
    
    return full_text

def generate_imagen_prompt(project):
    """Generate a detailed prompt for Imagen 4 including the project text."""
    project_text = format_project_text(project)
    
    prompt = f"""A photograph of a lined piece of notebook paper pinned to a cork notice board. The camera angle is perpendicular to the notice board, no tilt. The piece of paper takes up most of the image and has the following text written on it in neat, legible handwriting with a pen:

{project_text}

The handwriting should be clear, consistent, and easy to read. The text should follow the lines of the notebook paper. The pin is visible at the top. Realistic lighting and shadows. High quality photograph."""
    
    return prompt, project_text

def generate_image_imagen4(project, output_path, max_retries=3):
    """Generate image using Google's Imagen 4 with OCR verification."""
    
    try:
        # Initialize Google Gen AI client for Vertex AI
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
        location = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
        
        if not project_id:
            print("❌ GOOGLE_CLOUD_PROJECT_ID not set. Please set your Google Cloud project ID.")
            print("Run: export GOOGLE_CLOUD_PROJECT_ID='image-generator-web-page'")
            return False, None
            
        client = genai.Client(vertexai=True, project=project_id, location=location)
        
        prompt, expected_text = generate_imagen_prompt(project)
        
        print(f"🎨 Generated prompt:")
        print(f"   {prompt[:100]}...")
        print(f"📝 Expected text:")
        print(f"   {expected_text[:100]}...")
        
        for attempt in range(max_retries):
            print(f"\n🎨 Generation attempt {attempt + 1}/{max_retries}")
            
            try:
                # Generate image with Imagen 4
                response = client.models.generate_images(
                    model="imagen-4.0-generate-preview-06-06",
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
                
                # Save the generated image
                if response.generated_images:
                    generated_image = response.generated_images[0]
                    pil_image = generated_image.image._pil_image
                    
                    # Convert to RGB if needed and save
                    if pil_image.mode != "RGB":
                        pil_image = pil_image.convert("RGB")
                    pil_image.save(output_path)
                    
                    print(f"✅ Image generated, now verifying text...")
                    
                    # Print enhanced prompt if available
                    if hasattr(generated_image, 'enhanced_prompt') and generated_image.enhanced_prompt:
                        print(f"🔧 Enhanced prompt: {generated_image.enhanced_prompt[:100]}...")
                    
                    # OCR verification
                    try:
                        ocr_text = pytesseract.image_to_string(pil_image)
                            
                        similarity = similarity_score(expected_text, ocr_text)
                        print(f"📊 Text similarity: {similarity:.2%}")
                        
                        if similarity >= 0.6:  # Lower threshold for testing
                            print(f"✅ Text verification passed!")
                            print(f"📝 OCR detected: {ocr_text[:100]}...")
                            return True, ocr_text
                        else:
                            print(f"❌ Text similarity too low ({similarity:.2%} < 60%)")
                            print(f"Expected: {expected_text[:80]}...")
                            print(f"Got: {ocr_text[:80]}...")
                            
                            if attempt < max_retries - 1:
                                print(f"🔄 Retrying...")
                                time.sleep(2)
                    
                    except Exception as ocr_error:
                        print(f"❌ OCR error: {ocr_error}")
                        if attempt < max_retries - 1:
                            print(f"🔄 Retrying...")
            
            except Exception as gen_error:
                print(f"❌ Generation error: {gen_error}")
                if attempt < max_retries - 1:
                    print(f"🔄 Retrying...")
                    time.sleep(2)
        
        print(f"❌ Failed after {max_retries} attempts")
        return False, None
        
    except Exception as e:
        print(f"❌ Error with Imagen 4: {e}")
        return False, None

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
    """Create test directories."""
    directories = [
        '../images/test_notice_boards/original',
        '../images/test_notice_boards/compressed'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")

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
    create_test_directories()
    
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
    original_path = "../images/test_notice_boards/original/dancing_creatures.png"
    compressed_path = "../images/test_notice_boards/compressed/dancing_creatures.jpg"
    
    print(f"\n🔄 Processing: {project['title']}")
    
    # Generate image with text
    success, ocr_text = generate_image_imagen4(project, original_path)
    
    if success:
        print(f"🎉 Generation successful!")
        
        # Save OCR results
        with open("../images/test_notice_boards/dancing_creatures_ocr.txt", 'w') as f:
            expected_text = format_project_text(project)
            similarity = similarity_score(expected_text, ocr_text)
            f.write(f"Project: {project['title']}\n")
            f.write(f"Similarity Score: {similarity:.2%}\n")
            f.write(f"\n--- Expected Text ---\n{expected_text}\n")
            f.write(f"\n--- OCR Result ---\n{ocr_text}\n")
        
        # Downscale and compress
        if downscale_with_jpeg(original_path, compressed_path):
            print(f"✅ Test complete!")
            print(f"📁 Original: {original_path}")
            print(f"📁 Compressed: {compressed_path}")
            print(f"📄 OCR analysis: ../images/test_notice_boards/dancing_creatures_ocr.txt")
        else:
            print(f"⚠️  Generation successful but compression failed")
    else:
        print(f"❌ Test failed - could not generate acceptable image")
        print(f"💡 This is normal for experimental text generation!")

if __name__ == "__main__":
    main() 