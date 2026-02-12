# Custom Images Upload Guide

Upload your personal Valentine's Day photos here!

## Required Images

You need **2 images** with these exact filenames:

1. **`valentine-default.jpg`** - The initial image shown when the page loads
2. **`valentine-success.jpg`** - The image shown after clicking "Yes"

## Supported Formats

- `.jpg` or `.jpeg` (preferred)
- `.png`
- `.gif`

If using a different format, update the file extension in `/js/config.js`

## How to Upload

1. **Prepare your images:**
   - Choose 2 photos you want to display
   - Rename them exactly as shown above

2. **Upload to this folder:**
   - Drag and drop the images into this `custom/` folder
   - Or use your preferred method to copy them here

3. **Refresh the webpage:**
   - Open `index.html` in your browser
   - Your custom images should now appear!

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
