# 🚀 Experimental Notice Board Generator Setup

This experimental version generates complete notice board images including handwritten project text using Google's Imagen 3, then uses OCR to verify the text accuracy with automatic retries.

## ⚠️ Experimental Nature

This is a cutting-edge experiment that pushes the boundaries of what's possible with AI image generation. Expect:
- **High failure rates** (text generation in images is still challenging)
- **Multiple retries** per project (up to 5 attempts each)
- **Higher costs** due to retries and premium model usage
- **Fascinating results** when it works!

## 🛠️ Prerequisites

### 1. Install System Dependencies

**macOS:**
```bash
# Install Tesseract for OCR
brew install tesseract

# Install Python dependencies
pip install -r requirements_experimental.txt
```

**Ubuntu/Debian:**
```bash
# Install Tesseract
sudo apt-get update
sudo apt-get install tesseract-ocr

# Install Python dependencies
pip install -r requirements_experimental.txt
```

### 2. Google Cloud Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID (you'll need this)

#### Step 2: Enable APIs
```bash
# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

Or enable via Console:
1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Search and enable "Vertex AI API"
3. Search and enable "Compute Engine API"

#### Step 3: Create Service Account
```bash
# Create service account
gcloud iam service-accounts create imagen-generator \
    --description="Service account for experimental notice board generator" \
    --display-name="Imagen Generator"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:imagen-generator@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Create and download key
gcloud iam service-accounts keys create ~/imagen-generator-key.json \
    --iam-account=imagen-generator@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

#### Step 4: Set Environment Variables
```bash
# Set authentication
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/imagen-generator-key.json"
export GOOGLE_CLOUD_PROJECT_ID="YOUR_PROJECT_ID"

# Make permanent (add to ~/.zshrc or ~/.bashrc)
echo 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/imagen-generator-key.json"' >> ~/.zshrc
echo 'export GOOGLE_CLOUD_PROJECT_ID="YOUR_PROJECT_ID"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Test Your Setup

```bash
# Test Google Cloud authentication
gcloud auth application-default print-access-token

# Test Tesseract installation
tesseract --version

# Test Python dependencies
python -c "import google.cloud.aiplatform; import pytesseract; print('✅ All dependencies installed')"
```

## 🎨 Running the Experiment

```bash
# Run the experimental generator
python generate_notice_boards_with_text.py
```

## 📊 What to Expect

### Success Scenario
```
🔄 Processing project 1/28: Dancing Creatures
  🎨 Generation attempt 1/5
  ✅ Image generated, now verifying text...
  📊 Text similarity: 78.5%
  ✅ Text verification passed!
  ✅ Downscaled and compressed: images/notice_boards_with_text/compressed/dancing_creatures.jpg
```

### Retry Scenario
```
🔄 Processing project 2/28: Badbits: AI-powered Posture/Nailbiting Coach
  🎨 Generation attempt 1/5
  ✅ Image generated, now verifying text...
  📊 Text similarity: 45.2%
  ❌ Text similarity too low (45.2% < 70%)
  Expected: Title: Badbits: AI-powered Posture/Nailbiting Coach...
  Got: Tithe: Badbitz: Al-powered Posture/Neilbiting Couch...
  🔄 Retrying...
  🎨 Generation attempt 2/5
  ...
```

## 💰 Cost Estimation

**Google Imagen 3 Pricing:**
- ~$0.04 per image generation
- With retries: ~$0.08-$0.20 per successful project
- **Total estimated cost: $2.24-$5.60** for all 28 projects

## 📁 Output Structure

```
images/
└── notice_boards_with_text/
    ├── original/              # Full-size generated images
    │   ├── dancing_creatures.png
    │   └── ...
    ├── compressed/            # 50% downscaled JPEG files
    │   ├── dancing_creatures.jpg
    │   └── ...
    └── ocr_results/           # Text analysis results
        ├── dancing_creatures.txt
        └── ...
```

## 📝 Analyzing Results

Check the OCR results to see how well the text generation worked:

```bash
# View OCR analysis for a project
cat images/notice_boards_with_text/ocr_results/dancing_creatures.txt
```

Each file contains:
- **Project name**
- **Similarity score** (how well OCR matched expected text)
- **Expected text** (what we asked for)
- **OCR result** (what was actually generated)

## 🐛 Troubleshooting

### Authentication Issues
```bash
# Re-authenticate
gcloud auth application-default login

# Check current project
gcloud config get-value project

# Test API access
gcloud ai models list --region=us-central1
```

### OCR Issues
```bash
# Test Tesseract
echo "Hello World" | tesseract stdin stdout

# Check if image is readable
pytesseract image_to_string your_image.png
```

### Memory/Performance
- The script processes one image at a time to avoid overwhelming the API
- Each generation can take 30-60 seconds
- Total runtime: 30-60 minutes for all projects

## 🎯 Success Tips

1. **Be patient**: Text generation in images is extremely challenging
2. **Monitor results**: Check OCR analysis files to understand what's working
3. **Adjust threshold**: You can modify the 70% similarity threshold in the script
4. **Resume capability**: Script safely resumes if interrupted
5. **Backup originals**: Keep the original images for manual review

## 🔬 The Science

This experiment tests the cutting edge of:
- **Multimodal AI**: Generating images with specific text content
- **OCR accuracy**: How well we can verify generated text
- **Prompt engineering**: Crafting prompts for consistent handwriting
- **Quality control**: Automated verification and retry systems

Even if some generations fail, the successful ones will be fascinating examples of AI generating realistic handwritten content!

## 🚀 Ready to Launch?

Run the experiment and let's see how far we can push the boundaries of AI-generated content! 

```bash
python generate_notice_boards_with_text.py
```

The future of web design might just be in your terminal! 🎨✨ 