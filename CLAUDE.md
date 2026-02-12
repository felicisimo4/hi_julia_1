# Claude Context File - Valentine's Day Interactive Webpage

## Project Overview
An interactive Valentine's Day webpage with gamification elements including love meters, animated characters, progressive visual effects, and multiple engagement tiers. Built by boyfriend Manny for girlfriend Julia.

**Key Features:**
- Image cycling system (18 photos rotate every 3s)
- Love meter with localStorage persistence
- Three love tiers with unlockable animations (otters → sheep → kissing)
- Progressive glow effects on container
- Growing Yes button with rainbow effects at max size
- 20 escalating success messages
- Mobile-optimized for iPhone 16 Pro (393px viewport)
- No scrolling on mobile (locked viewport)

## Project Structure

```
hi_julia_1/
├── index.html                 # Main HTML (34 lines, minimal markup)
├── CLAUDE.md                  # This file - AI context
├── README.md                  # User documentation
├── .gitignore                 # Excludes node_modules, dev files
│
├── css/                       # Modular CSS (3 files)
│   ├── main.css              # Layout, glow effects, mobile responsive
│   ├── components.css        # Buttons, love meter, hints, press effects
│   └── animations.css        # Keyframes for otters, sheep, kiss, floatUp
│
├── js/                        # ES6 modules (4 files)
│   ├── config.js             # All constants (IMAGES, MESSAGES, LOVE_TIERS)
│   ├── state.js              # ValentineState class, localStorage
│   ├── animations.js         # Visual effects (otters, glow, image swap)
│   └── handlers.js           # Event handlers, initialization
│
└── assets/images/
    ├── README.md             # Asset upload instructions
    ├── placeholders/         # Fallback images (tracked)
    └── custom/               # User photos (git-ignored)
        ├── cycling/          # 18 images that rotate
        │   ├── DSCN0188_Original.JPG
        │   ├── IMG_*.JPG     # (17 more)
        └── success/          # Success image after "Yes"
            └── valentine-success.jpg
```

## Architecture

### State Management (state.js)
**ValentineState class** - Single source of truth for all state:
```javascript
{
  loveCount: 0,           // Yes clicks, saved to localStorage
  noClickCount: 0,        // No clicks, controls button size
  yesPadding: 12,         // Current Yes button padding
  yesFontSize: 16,        // Current Yes button font size
  messageIndex: 0,        // Current pleading message index
  currentImageIndex: 0    // Current cycling image index
}
```

**Key Methods:**
- `loadLoveCount()` - Loads from localStorage, recalculates button size
- `incrementLove()` - Increments love count, saves to localStorage
- `growButton()` - Grows Yes button, caps at max, returns atMaxSize flag
- `reset()` - Clears all state and localStorage

### Configuration (config.js)
All magic numbers and content in one place:

**IMAGES:**
- `defaultImages[]` - Array of 18 cycling image paths
- `success` - Success image path
- Fallback URLs for missing images

**MESSAGES:**
- `initial` - Starting message
- `successSequence[]` - 20 escalating messages after Yes clicks
- `pleading[]` - 6 messages cycling on No clicks

**LOVE_TIERS:**
- `tier1: 10 clicks` - Sheep unlock
- `tier2: 50 clicks` - Kissing animation
- Hint messages for each tier

**BUTTON_GROWTH:**
- `maxPadding: 40` - Cap for button growth
- `maxFontSize: 32` - Cap for font growth

### Visual Effects System

**Love Glow (4 levels):**
```javascript
data-love-glow="0"  // 0 clicks: No glow
data-love-glow="1"  // 1-9 clicks: Gentle red glow, 3s pulse
data-love-glow="2"  // 10-49 clicks: Medium pink glow, 2.5s pulse
data-love-glow="3"  // 50+ clicks: Maximum radiance, 2s pulse
```

**Animation Tiers:**
```javascript
clicks < 10:  createFloatingOtter(button)
clicks 10-49: createFloatingOtterAndSheep(button)
clicks >= 50: createKissingLove(button) // 🐑💋🦦 with spin
```

**Button States:**
```javascript
yesPadding < 40:   Normal growth
yesPadding >= 40:  Add .max-size class
                   → Rainbow gradient
                   → Pulsing glow
                   → Shake animation
```

## Key Implementation Details

### Image Cycling
- Starts on page load if loveCount === 0
- Stops on first Yes click
- Random starting image
- 3-second interval (IMAGE_CYCLE_INTERVAL)
- Fallback chain: custom → cycling → placeholder URL

### Mobile Optimization (iPhone 16 Pro)
**Viewport:** 393px width
- `viewport-fit=cover` for Dynamic Island
- `safe-area-inset` padding
- No scrolling: `overflow: hidden; position: fixed` on html/body
- Container uses `100dvh` (dynamic viewport height)
- Images capped at `40vh` height
- Gentler glow effects (50% intensity)

### Button Press Feedback
**Three states:**
1. Default: `translateY(0)`, normal shadow
2. Hover: `translateY(-2px)`, lift up, larger shadow
3. Active: `translateY(2px) scale(0.98)`, press down

**Ripple effect:** CSS-only, white circle expands from click point

### localStorage Keys
```javascript
'loveCount'     // Yes clicks (love meter)
'noClickCount'  // No clicks (button size)
```

## Common Tasks

### Add New Success Message
1. Edit `js/config.js`
2. Add to `MESSAGES.successSequence[]` array
3. Messages display based on index: `successSequence[loveCount - 1]`

### Add New Love Tier
1. Edit `js/config.js` → Add to `LOVE_TIERS`
2. Edit `js/handlers.js` → Update `handleYes()` conditionals
3. Edit `js/animations.js` → Create new animation function
4. Edit `css/animations.css` → Add animation keyframes

### Change Button Size Cap
1. Edit `js/config.js` → `BUTTON_GROWTH.maxPadding` and `maxFontSize`
2. Button will stop growing at these values
3. Visual effects trigger when at max

### Add New Glow Level
1. Edit `css/main.css` → Add `[data-love-glow="4"]` selector
2. Edit `js/animations.js` → Update `updateLoveGlow()` logic
3. Define box-shadow layers and animation

## Important Notes

### Image Paths
- Always use relative paths: `./assets/images/...`
- Fallback system: Try custom image first, then placeholder
- `swapImage()` handles fallback via `img.onerror`

### Button Growth Tracking
- `noClickCount` tracks No clicks (not love count!)
- Button size calculated: `initialSize + (noClickCount * increment)`
- Must reload from localStorage on page load
- Capped at `maxPadding` and `maxFontSize`

### Animation Performance
- Use `transform` and `opacity` for 60fps
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Clean up animations with `setTimeout(() => element.remove())`

### Mobile Considerations
- Test on actual iPhone 16 Pro (393px viewport)
- Use `100dvh` not `100vh` (accounts for browser chrome)
- Safe area insets for notch/Dynamic Island
- Touch targets minimum 44px (Apple guideline)
- Gentler effects on mobile to prevent overwhelm

## Testing Checklist

**Functionality:**
- [ ] Images cycle every 3 seconds
- [ ] Yes button: increments love meter, shows otter, changes message
- [ ] No button: grows Yes button, shows pleading message
- [ ] At 10 clicks: sheep appear with otter
- [ ] At 50 clicks: kissing animation with spin
- [ ] Love meter persists after page reload
- [ ] Reset button clears all state

**Visual Effects:**
- [ ] Container glow intensifies with love count
- [ ] Yes button caps at max size, adds rainbow effects
- [ ] Button press feels tactile (sink down, ripple)
- [ ] Love tier hint updates correctly
- [ ] Success messages cycle through 20 variations

**Mobile (iPhone 16 Pro):**
- [ ] No scrolling (page locked)
- [ ] All elements visible in viewport
- [ ] Touch targets easily tappable
- [ ] Glow effects not overwhelming
- [ ] Animations smooth at 60fps

## File Dependencies

```
index.html
  ├─> css/main.css
  ├─> css/components.css
  ├─> css/animations.css
  └─> js/handlers.js (type="module")
       ├─> js/config.js
       ├─> js/state.js
       └─> js/animations.js
```

**Import chain:**
- `handlers.js` imports everything
- Other modules export functions/constants
- No circular dependencies

## Version History

**v1.0** - Initial monolithic file (260 lines)
**v2.0** - Refactored to modular structure
**v3.0** - Added image cycling (18 photos)
**v4.0** - Added love tiers (sheep, kissing)
**v5.0** - Added progressive glow effects
**v6.0** - Added button size cap with visual effects
**v7.0** - Added tactile button press feedback

## Contact

Created by: Boyfriend Manny
For: Girlfriend Julia
Built with: Claude Sonnet 4.5
Repository: github.com/felicisimo4/hi_julia_1
