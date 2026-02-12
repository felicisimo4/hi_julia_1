# Image Assets

This directory contains all images for the Valentine's Day webpage.

## Directory Structure

- **placeholders/** - Default fallback images (git-tracked)
  - These images are displayed when custom images are not available
  - Used as automatic fallbacks via the `img.onerror` handler

- **custom/** - Your personal photos (git-ignored)
  - Upload your custom images here
  - These take precedence over placeholder images
  - Not tracked by git to keep your photos private

## How It Works

The webpage uses a two-tier fallback system:

1. First, it tries to load images from the `custom/` folder
2. If that fails, it automatically falls back to the placeholder images

This means you can simply drop your photos into the `custom/` folder and the webpage will automatically use them!

## Uploading Your Custom Images

See the README.md file in the `custom/` folder for detailed upload instructions.
