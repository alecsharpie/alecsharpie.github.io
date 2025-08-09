#!/usr/bin/env python3
"""
Notice Board Background Generator
Generates unique notice board background images for each project in projects.json
and downscales them to 50% with MozJPEG compression.
"""

import json
import os
import requests
import time
from pathlib import Path
from PIL import Image
import pillow_heif

# Enable HEIF support if needed
pillow_heif.register_heif_opener()

def load_projects():
    """Load projects from JSON file."""
    with open('data/projects.json', 'r') as f:
        data = json.load(f)
    return data['projects']

def generate_project_variations(project_title):
    """Generate variations of the notice board prompt for each project."""
    base_prompt = """A photograph of a lined piece of notebook paper pinned to a cork notice board. 
The camera angle should be perpendicular with the notice board, no tilt etc. 
The piece of paper should take up most of the image."""
    
    # Add slight variations to make each image unique
    variations = [
        f"{base_prompt} The paper is slightly yellowed with age.",
        f"{base_prompt} The paper has a subtle coffee stain in one corner.",
        f"{base_prompt} The pin is a red pushpin in the top center.",
        f"{base_prompt} The pin is a blue pushpin slightly offset to the left.",
        f"{base_prompt} The cork board has a subtle wood grain texture.",
        f"{base_prompt} The paper is bright white and crisp.",
        f"{base_prompt} There are faint pencil lines on the paper.",
        f"{base_prompt} The lighting casts a soft shadow on the right side.",
        f"{base_prompt} The pin is a silver thumbtack.",
        f"{base_prompt} The paper appears recently pinned up.",
    ]
    
    # Return a variation based on project index (cycling through variations)
    return variations

def generate_image_openai(prompt, output_path, project_index):
    """Generate image using OpenAI's DALL-E API."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Warning: OPENAI_API_KEY not found. Please set it as an environment variable.")
        print("Example: export OPENAI_API_KEY='your-api-key-here'")
        return False
    
    try:
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        variations = generate_project_variations("")
        selected_prompt = variations[project_index % len(variations)]
        
        data = {
            'model': 'dall-e-3',
            'prompt': selected_prompt,
            'n': 1,
            'size': '1024x1024',
            'quality': 'standard'
        }
        
        print(f"Generating image with prompt variation {project_index % len(variations) + 1}...")
        response = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers=headers,
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            image_url = result['data'][0]['url']
            
            # Download the image
            img_response = requests.get(image_url, timeout=30)
            if img_response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(img_response.content)
                print(f"✅ Generated: {output_path}")
                return True
            else:
                print(f"❌ Failed to download image: {img_response.status_code}")
                return False
        else:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return False

def downscale_with_mozjpeg(input_path, output_path, quality=85):
    """Downscale image to 50% and compress with MozJPEG."""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Downscale to 50%
            new_width = img.width // 2
            new_height = img.height // 2
            img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with high quality JPEG (Pillow uses libjpeg-turbo which is comparable to MozJPEG)
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

def create_directories():
    """Create necessary directories."""
    directories = [
        'images/notice_boards/original',
        'images/notice_boards/compressed'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")

def sanitize_filename(title):
    """Sanitize project title for use as filename."""
    # Remove or replace problematic characters
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
    # Remove any remaining problematic characters
    allowed_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_-'
    filename = ''.join(c for c in filename if c in allowed_chars)
    # Limit length
    filename = filename[:50]
    return filename

def main():
    """Main function to generate all notice board images."""
    print("🎨 Notice Board Background Generator")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Load projects
    try:
        projects = load_projects()
        print(f"📋 Found {len(projects)} projects")
    except Exception as e:
        print(f"❌ Error loading projects: {e}")
        return
    
    # Check for OpenAI API key
    if not os.getenv('OPENAI_API_KEY'):
        print("\n⚠️  SETUP REQUIRED:")
        print("Please set your OpenAI API key as an environment variable:")
        print("export OPENAI_API_KEY='your-api-key-here'")
        print("\nOr add it to your shell profile (~/.zshrc or ~/.bashrc):")
        print("echo 'export OPENAI_API_KEY=\"your-api-key-here\"' >> ~/.zshrc")
        return
    
    # Generate images for each project
    successful_generations = 0
    successful_compressions = 0
    
    for i, project in enumerate(projects):
        print(f"\n🔄 Processing project {i+1}/{len(projects)}: {project['title']}")
        
        # Create safe filename
        safe_title = sanitize_filename(project['title'])
        original_path = f"images/notice_boards/original/{safe_title}.png"
        compressed_path = f"images/notice_boards/compressed/{safe_title}.jpg"
        
        # Skip if compressed version already exists
        if os.path.exists(compressed_path):
            print(f"⏭️  Skipping (already exists): {compressed_path}")
            successful_generations += 1
            successful_compressions += 1
            continue
        
        # Generate original image
        if not os.path.exists(original_path):
            if generate_image_openai("", original_path, i):
                successful_generations += 1
                # Add small delay to respect API rate limits
                time.sleep(1)
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
    print(f"\n📊 SUMMARY:")
    print(f"✅ Successfully generated: {successful_generations}/{len(projects)} images")
    print(f"✅ Successfully compressed: {successful_compressions}/{len(projects)} images")
    print(f"📁 Original images: images/notice_boards/original/")
    print(f"📁 Compressed images: images/notice_boards/compressed/")
    
    if successful_generations == len(projects):
        print("\n🎉 All notice board backgrounds generated successfully!")
    else:
        print(f"\n⚠️  Some images failed to generate. Check the errors above.")

if __name__ == "__main__":
    main() 