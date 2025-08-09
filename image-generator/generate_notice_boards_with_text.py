#!/usr/bin/env python3
"""
Experimental Notice Board Generator with Text
Generates complete notice board images including project text using Google's Imagen 3,
then uses OCR to verify the text matches and retries if needed.
"""

import json
import os
import time
import re
from pathlib import Path
from PIL import Image
import requests
import pytesseract
from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from difflib import SequenceMatcher

def load_projects():
    """Load projects from JSON file."""
    with open('data/projects.json', 'r') as f:
        data = json.load(f)
    return data['projects']

def clean_text_for_comparison(text):
    """Clean text for comparison by removing extra whitespace and normalizing."""
    # Remove extra whitespace, newlines, and normalize
    text = re.sub(r'\s+', ' ', text.strip().lower())
    # Remove common OCR artifacts
    text = re.sub(r'[^\w\s\-\.\,\!\?]', '', text)
    return text

def similarity_score(text1, text2):
    """Calculate similarity between two text strings."""
    clean1 = clean_text_for_comparison(text1)
    clean2 = clean_text_for_comparison(text2)
    return SequenceMatcher(None, clean1, clean2).ratio()

def format_project_text(project):
    """Format project information for the notice board."""
    # Keep text concise for better generation
    title = project['title']
    date = project['date']
    description = project['description'][:200] + "..." if len(project['description']) > 200 else project['description']
    
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
    """Generate a detailed prompt for Imagen 3 including the project text."""
    project_text = format_project_text(project)
    
    prompt = f"""A photograph of a lined piece of notebook paper pinned to a cork notice board. The camera angle is perpendicular to the notice board, no tilt. The piece of paper takes up most of the image and has the following text written on it in neat handwriting with a pen:

{project_text}

The handwriting should be legible, consistent, and fit naturally on the lined paper. The text should follow the lines of the notebook paper. The pin is visible at the top. Realistic lighting and shadows. High quality photograph."""
    
    return prompt, project_text

def generate_image_imagen3(project, output_path, max_retries=5):
    """Generate image using Google's Imagen 3 with OCR verification."""
    
    # Check if Google Cloud credentials are set
    if not os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
        print("❌ GOOGLE_APPLICATION_CREDENTIALS not set. Please set up Google Cloud authentication.")
        return False, None
    
    try:
        # Initialize Vertex AI
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
        if not project_id:
            print("❌ GOOGLE_CLOUD_PROJECT_ID not set. Please set your Google Cloud project ID.")
            return False, None
            
        aiplatform.init(project=project_id, location="us-central1")
        
        prompt, expected_text = generate_imagen_prompt(project)
        
        for attempt in range(max_retries):
            print(f"  🎨 Generation attempt {attempt + 1}/{max_retries}")
            
            try:
                # Generate image with Imagen 3
                model = aiplatform.Model("publishers/google/models/imagen-3.0-generate-001")
                
                response = model.predict(
                    instances=[{
                        "prompt": prompt,
                        "sampleCount": 1,
                        "aspectRatio": "1:1",
                        "safetyFilterLevel": "block_some",
                        "personGeneration": "dont_allow"
                    }]
                )
                
                # Extract and save image
                if response.predictions:
                    image_data = response.predictions[0]['bytesBase64Encoded']
                    import base64
                    image_bytes = base64.b64decode(image_data)
                    
                    with open(output_path, 'wb') as f:
                        f.write(image_bytes)
                    
                    print(f"  ✅ Image generated, now verifying text...")
                    
                    # OCR verification
                    try:
                        with Image.open(output_path) as img:
                            ocr_text = pytesseract.image_to_string(img)
                            
                        similarity = similarity_score(expected_text, ocr_text)
                        print(f"  📊 Text similarity: {similarity:.2%}")
                        
                        if similarity >= 0.7:  # 70% similarity threshold
                            print(f"  ✅ Text verification passed!")
                            return True, ocr_text
                        else:
                            print(f"  ❌ Text similarity too low ({similarity:.2%} < 70%)")
                            print(f"  Expected: {expected_text[:100]}...")
                            print(f"  Got: {ocr_text[:100]}...")
                            
                            if attempt < max_retries - 1:
                                print(f"  🔄 Retrying...")
                                time.sleep(2)  # Brief pause before retry
                    
                    except Exception as ocr_error:
                        print(f"  ❌ OCR error: {ocr_error}")
                        if attempt < max_retries - 1:
                            print(f"  🔄 Retrying...")
            
            except Exception as gen_error:
                print(f"  ❌ Generation error: {gen_error}")
                if attempt < max_retries - 1:
                    print(f"  🔄 Retrying...")
                    time.sleep(2)
        
        print(f"  ❌ Failed after {max_retries} attempts")
        return False, None
        
    except Exception as e:
        print(f"❌ Error with Imagen 3: {e}")
        return False, None

def downscale_with_mozjpeg(input_path, output_path, quality=85):
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
            print(f"  ✅ Downscaled and compressed: {output_path}")
            return True
            
    except Exception as e:
        print(f"  ❌ Error processing image: {e}")
        return False

def create_directories():
    """Create necessary directories."""
    directories = [
        'images/notice_boards_with_text/original',
        'images/notice_boards_with_text/compressed',
        'images/notice_boards_with_text/ocr_results'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")

def sanitize_filename(title):
    """Sanitize project title for use as filename."""
    filename = title.lower()
    filename = filename.replace(' ', '_')
    filename = filename.replace('&', 'and')
    filename = filename.replace('/', '_')
    filename = filename.replace('\\', '_')
    filename = filename.replace(':', '_')
    filename = filename.replace('?', '')
    filename = filename.replace('!', '')
    filename = filename.replace('"', '')
    filename = filename.replace("'", '')
    filename = filename.replace('#', '')
    filename = filename.replace('%', '')
    allowed_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_-'
    filename = ''.join(c for c in filename if c in allowed_chars)
    filename = filename[:50]
    return filename

def save_ocr_result(project_title, expected_text, ocr_text, similarity):
    """Save OCR results for analysis."""
    safe_title = sanitize_filename(project_title)
    result_path = f"images/notice_boards_with_text/ocr_results/{safe_title}.txt"
    
    with open(result_path, 'w') as f:
        f.write(f"Project: {project_title}\n")
        f.write(f"Similarity Score: {similarity:.2%}\n")
        f.write(f"\n--- Expected Text ---\n{expected_text}\n")
        f.write(f"\n--- OCR Result ---\n{ocr_text}\n")

def main():
    """Main function to generate all notice board images with text."""
    print("🎨 Experimental Notice Board Generator with Text")
    print("🚀 Using Google Imagen 3 + OCR Verification")
    print("=" * 60)
    
    # Check dependencies
    try:
        import pytesseract
        import google.cloud.aiplatform
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install: pip install pytesseract google-cloud-aiplatform")
        return
    
    # Create directories
    create_directories()
    
    # Load projects
    try:
        projects = load_projects()
        print(f"📋 Found {len(projects)} projects")
    except Exception as e:
        print(f"❌ Error loading projects: {e}")
        return
    
    # Check for required environment variables
    missing_vars = []
    if not os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
        missing_vars.append('GOOGLE_APPLICATION_CREDENTIALS')
    if not os.getenv('GOOGLE_CLOUD_PROJECT_ID'):
        missing_vars.append('GOOGLE_CLOUD_PROJECT_ID')
    
    if missing_vars:
        print(f"\n⚠️  SETUP REQUIRED:")
        print(f"Missing environment variables: {', '.join(missing_vars)}")
        print(f"\nSetup Google Cloud:")
        print(f"1. Create a Google Cloud project")
        print(f"2. Enable Vertex AI API")
        print(f"3. Create service account and download key")
        print(f"4. Set GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json")
        print(f"5. Set GOOGLE_CLOUD_PROJECT_ID=your-project-id")
        return
    
    # Generate images for each project
    successful_generations = 0
    successful_compressions = 0
    total_attempts = 0
    
    for i, project in enumerate(projects):
        print(f"\n🔄 Processing project {i+1}/{len(projects)}: {project['title']}")
        
        safe_title = sanitize_filename(project['title'])
        original_path = f"images/notice_boards_with_text/original/{safe_title}.png"
        compressed_path = f"images/notice_boards_with_text/compressed/{safe_title}.jpg"
        
        # Skip if compressed version already exists
        if os.path.exists(compressed_path):
            print(f"⏭️  Skipping (already exists): {compressed_path}")
            successful_generations += 1
            successful_compressions += 1
            continue
        
        # Generate image with text
        if not os.path.exists(original_path):
            success, ocr_text = generate_image_imagen3(project, original_path)
            total_attempts += 1
            
            if success:
                successful_generations += 1
                # Save OCR results for analysis
                expected_text = format_project_text(project)
                similarity = similarity_score(expected_text, ocr_text)
                save_ocr_result(project['title'], expected_text, ocr_text, similarity)
                
                # Brief pause between generations
                time.sleep(3)
            else:
                print(f"⏭️  Skipping compression due to generation failure")
                continue
        else:
            print(f"✅ Using existing original: {original_path}")
            successful_generations += 1
        
        # Downscale and compress
        if downscale_with_mozjpeg(original_path, compressed_path):
            successful_compressions += 1
    
    # Summary
    print(f"\n📊 EXPERIMENTAL RESULTS:")
    print(f"✅ Successfully generated: {successful_generations}/{len(projects)} images")
    print(f"✅ Successfully compressed: {successful_compressions}/{len(projects)} images")
    print(f"🔄 Total generation attempts: {total_attempts}")
    print(f"📁 Original images: images/notice_boards_with_text/original/")
    print(f"📁 Compressed images: images/notice_boards_with_text/compressed/")
    print(f"📁 OCR analysis: images/notice_boards_with_text/ocr_results/")
    
    if successful_generations == len(projects):
        print("\n🎉 Experimental generation complete!")
        print("📝 Check OCR results to see how well the text was generated!")
    else:
        print(f"\n⚠️  Some images failed to generate. This is expected for this experimental approach.")

if __name__ == "__main__":
    main() 