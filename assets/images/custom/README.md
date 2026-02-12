# Custom Images Upload Guide

Upload your personal Valentine's Day photos here!

## Directory Structure

- **`cycling/`** - Contains 18 images that cycle every 3 seconds on the main page
- **`success/`** - Contains the success image shown after clicking "Yes"

## Required Images

- **Cycling images:** 18 images in the `cycling/` directory (already uploaded)
- **Success image:** 1 image named `valentine-success.jpg` in the `success/` directory

## Supported Formats

- `.jpg` or `.jpeg` (preferred)
- `.png`
- `.gif`

If using a different format, update the file extension in `/js/config.js`

## How to Upload Success Image

1. **Prepare your success image:**
   - Choose the photo to display after "Yes" is clicked
   - Name it `valentine-success.jpg`

2. **Upload to success folder:**
   - Copy to: `assets/images/custom/success/valentine-success.jpg`
   - Docker command: `docker cp ./valentine-success.jpg d4d0ac6b537b:/workspaces/ff/hi_julia_1/assets/images/custom/success/`

3. **Refresh the webpage:**
   - Open `index.html` in your browser
   - Click "Yes" to see your success image!

## Image Specifications

- **Recommended size:** 400x300 pixels (or similar aspect ratio)
- **Maximum size:** Keep under 5MB for fast loading
- **Format:** Any web-compatible format (JPG, PNG, GIF)

## Privacy Note

Images in this folder are **not tracked by git**, so they remain private to your local copy of the project. This is configured in the `.gitignore` file.

## Troubleshooting

**Images not showing up?**

1. Check that filenames match exactly (case-sensitive)
2. Verify the file format matches what's in `/js/config.js`
3. Try hard-refreshing the browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors (F12 → Console tab)

**Want to use different filenames?**

Edit the `IMAGES` object in `/js/config.js` to use your preferred filenames.
