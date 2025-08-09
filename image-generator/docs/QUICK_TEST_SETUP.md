# 🚀 Quick Test Setup - Dancing Creatures

Test the notice board generator with just one project using `uv`.

## 1. Install Dependencies

```bash
cd image-generator

# Install system dependencies (macOS)
brew install tesseract

# Install Python dependencies with uv
uv add requests Pillow pytesseract google-cloud-aiplatform google-cloud-core
```

## 2. Google Cloud Setup (Required)

Set up your GCP project and authentication:

```bash
# Set your project as active
gcloud config set project image-generator-web-page

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com

# Set up application default credentials (uses your user auth)
gcloud auth application-default login

# Set project ID environment variable
export GOOGLE_CLOUD_PROJECT_ID="image-generator-web-page"
```

## 3. Run the Test

```bash
uv run test_dancing_creatures.py
```

## What It Will Do

🎯 **Single Project Test**: Only processes "Dancing Creatures" project  
📝 **Text Content**: Generates notice board with handwritten project info  
🔍 **OCR Verification**: Checks if generated text matches expected content  
📊 **Lower Threshold**: Uses 60% similarity (easier to achieve)  
🔄 **3 Retries**: Up to 3 attempts to get acceptable results  

## Expected Output

```
🎨 Testing Notice Board Generator with Dancing Creatures
🚀 Using Google Imagen 3 + OCR Verification
============================================================
✅ All dependencies available
📁 Created directory: ../images/test_notice_boards/original
📁 Created directory: ../images/test_notice_boards/compressed
📋 Loaded project: Dancing Creatures

🎨 Generated prompt:
   A photograph of a lined piece of notebook paper pinned to a cork notice board...
📝 Expected text:
   Title: Dancing Creatures Date: 2025-03-01 Description: Real-time multi-pose detection...

🎨 Generation attempt 1/3
✅ Image generated, now verifying text...
📊 Text similarity: 65.3%
✅ Text verification passed!
📝 OCR detected: Title: Dancing Creatures Date: 2025-03-01 Description: Real-time...
✅ Downscaled and compressed: ../images/test_notice_boards/compressed/dancing_creatures.jpg
🎉 Generation successful!
✅ Test complete!
```

## Output Files

- `../images/test_notice_boards/original/dancing_creatures.png` - Full resolution
- `../images/test_notice_boards/compressed/dancing_creatures.jpg` - 50% downscaled  
- `../images/test_notice_boards/dancing_creatures_ocr.txt` - OCR analysis

## If It Fails

This is experimental! Text generation in images is extremely challenging. Even if it fails, you'll get:
- Debug output showing what went wrong
- Generated images (even if text doesn't match)
- OCR analysis to see what was actually generated

## Cost

~$0.04-$0.12 for this single test (depending on retries needed) 