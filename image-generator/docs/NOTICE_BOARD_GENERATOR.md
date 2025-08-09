# Notice Board Background Generator

This script automatically generates unique notice board background images for each project in your portfolio and downscales them to 50% with JPEG compression.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Get an OpenAI API key:**
   - Go to [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key
   - Set it as an environment variable:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```

   Or add it to your shell profile permanently:
   ```bash
   echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.zshrc
   source ~/.zshrc
   ```

## Usage

Run the script from your website root directory:

```bash
python generate_notice_boards.py
```

## What it does

1. **Reads your projects:** Loads all projects from `data/projects.json`
2. **Generates unique images:** Creates notice board variations for each project using DALL-E 3
3. **Smart variations:** Uses 10 different prompt variations to ensure each image is unique
4. **Organizes output:** 
   - Original 1024x1024 PNG images → `images/notice_boards/original/`
   - Compressed 512x512 JPEG images → `images/notice_boards/compressed/`
5. **Resumes safely:** Skips already generated images on re-runs

## Output Structure

```
images/
└── notice_boards/
    ├── original/          # Full-size PNG files
    │   ├── dancing_creatures.png
    │   ├── badbits_ai-powered_posturenailbiting_coach.png
    │   └── ...
    └── compressed/        # 50% downscaled JPEG files
        ├── dancing_creatures.jpg
        ├── badbits_ai-powered_posturenailbiting_coach.jpg
        └── ...
```

## Image Variations

The script generates 10 different notice board styles:
- Aged yellowed paper
- Coffee-stained paper  
- Different colored pushpins (red, blue, silver)
- Various lighting and shadow effects
- Different paper textures and conditions

## Cost Estimate

- **DALL-E 3 Standard:** ~$0.04 per image
- **Total for 28 projects:** ~$1.12

## Troubleshooting

- **API key issues:** Make sure your OpenAI API key is set correctly
- **Rate limiting:** The script includes 1-second delays between requests
- **Failed generations:** Check your API quota and internet connection
- **File permissions:** Ensure write access to the `images/` directory 