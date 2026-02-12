# Valentine's Day Webpage

A sweet, interactive Valentine's Day webpage with a love meter, growing buttons, and floating otter animations!

## Features

- ❤️ **Love Meter** - Tracks how many times "Yes" has been clicked (persists with localStorage)
- 🦦 **Floating Otters** - Animated otters appear when clicking "Yes"
- 📈 **Growing Yes Button** - The "Yes" button grows bigger each time "No" is clicked
- 💕 **Pleading Messages** - Rotating messages encouraging a "Yes" response
- 🖼️ **Custom Images** - Easy photo upload system with automatic fallbacks

## Project Structure

```
hi_julia_1/
├── index.html              # Clean HTML markup (~35 lines)
├── .gitignore              # Ignores custom photos
├── README.md               # This file
├── css/
│   ├── main.css            # Base layout and typography
│   ├── components.css      # UI components styling
│   └── animations.css      # Animations and keyframes
├── js/
│   ├── config.js           # Constants and configuration
│   ├── state.js            # State management and localStorage
│   ├── animations.js       # Animation functions
│   └── handlers.js         # Event handlers and initialization
└── assets/
    └── images/
        ├── placeholders/   # Default fallback images (git-tracked)
        ├── custom/         # Your photos (git-ignored)
        │   └── README.md   # Upload instructions
        └── README.md       # Asset management guide
```

## Quick Start

1. **Upload Your Photos:**
   - Add 2 images to `assets/images/custom/`:
     - `valentine-default.jpg` (initial image)
     - `valentine-success.jpg` (success image)
   - See `assets/images/custom/README.md` for details

2. **Open the Webpage:**
   - Open `index.html` in your web browser
   - Your custom images will automatically display!

3. **Enjoy:**
   - Click "Yes" to increment the love meter and see otters
   - Click "No" to make the "Yes" button grow bigger

## Customization

### Change Messages
Edit `js/config.js` → `MESSAGES` object

### Change Colors
Edit `css/components.css` for button and text colors

### Change Animation Speed
Edit `css/animations.css` → `@keyframes floatUp` timing

### Change Button Growth Rate
Edit `js/config.js` → `BUTTON_GROWTH` object

## Technical Details

- **No dependencies** - Pure HTML, CSS, and JavaScript
- **ES6 modules** - Modern JavaScript with import/export
- **localStorage** - Love count persists across page loads
- **Responsive** - Works on mobile and desktop
- **Image fallbacks** - Automatically uses placeholders if custom images missing

## File Overview

### CSS Files
- **main.css** - Base styles, layout, body background
- **components.css** - Buttons, messages, love meter widget
- **animations.css** - Floating otter animation keyframes

### JavaScript Files
- **config.js** - All constants (images, messages, button settings)
- **state.js** - ValentineState class managing all state variables
- **animations.js** - Animation utilities (floating otters, image swapping)
- **handlers.js** - Event handlers, page initialization, imports everything

## Privacy

Custom images in `assets/images/custom/` are **not tracked by git**, keeping your photos private.

## Credits

Made with ❤️ by boyfriend manny
