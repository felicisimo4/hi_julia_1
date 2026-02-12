# 💝 Valentine's Day Interactive Webpage

An engaging, gamified Valentine's Day webpage featuring progressive animations, love tiers, and satisfying interactions. Built with love by boyfriend Manny for Julia!

![Love Meter](https://img.shields.io/badge/Love%20Meter-Infinite-ff69b4)
![Mobile Optimized](https://img.shields.io/badge/Mobile-iPhone%2016%20Pro-blue)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green)

## ✨ Features

### Core Interactions
- 💕 **Love Meter** - Tracks Yes clicks with localStorage persistence
- 📸 **Photo Cycling** - 18 custom photos rotate every 3 seconds
- 📈 **Growing Yes Button** - Button expands with each No click, caps at max size
- 🌈 **Rainbow Effects** - Max-size button gets animated gradient and glow
- 🔄 **Reset Button** - Clear all progress and start fresh
- 💬 **20 Success Messages** - Escalating romantic messages with each Yes click

### Love Tier System
Unlock new animations as love grows:

| Tier | Clicks | Animation | Unlock Message |
|------|--------|-----------|----------------|
| 1 | 1-9 | 🦦 Solo Otter | "Surprise awaits at 10 clicks!" |
| 2 | 10-49 | 🦦🐑 Otter & Sheep | "Surprise awaits at 50 clicks!" |
| 3 | 50-499 | 🐑💋🦦 Kissing Love | "Surprise awaits at 500 clicks!" |
| 4 | 500+ | 🐍 Orbital Snakes | "You've unlocked all surprises!" |

### Progressive Visual Effects
Container glow intensifies with love:
- **Level 0** (0 clicks): Clean white container
- **Level 1** (1-9 clicks): Gentle red glow with pulse
- **Level 2** (10-49 clicks): Medium pink radiance
- **Level 3** (50-499 clicks): Maximum multi-layer glow
- **Level 4** (500+ clicks): Rainbow glow with orbital snakes

### Tactile Button Feedback
- Buttons lift on hover (-2px)
- Buttons press down on click (+2px, 98% scale)
- Ripple effect emanates from click point
- Snappy 0.05s transitions for instant feedback

## 📱 Mobile Optimized

Perfectly tuned for **iPhone 16 Pro** (393px viewport):
- No scrolling - page locked to viewport
- Safe area support for Dynamic Island
- Touch-friendly 44px minimum targets
- Gentler effects to prevent overwhelm
- Dynamic viewport height (100dvh)

## 🚀 Quick Start

### 1. Upload Your Photos

Add your photos to `assets/images/custom/`:

**For cycling (18 images):**
```
assets/images/custom/cycling/
├── photo1.jpg
├── photo2.jpg
└── ... (16 more)
```

**For success image (1 image):**
```
assets/images/custom/success/
└── valentine-success.jpg
```

> See `assets/images/custom/README.md` for detailed upload instructions

### 2. Open in Browser

Simply open `index.html` in any modern browser:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile Safari on iPhone
- Android Chrome

### 3. Interact!

- **Click "Yes"** → Increment love meter, see animations, get messages
- **Click "No"** → Grow the Yes button, cycle pleading messages
- **Reach 10 clicks** → Unlock Tier 2: Sheep animations! 🐑
- **Reach 50 clicks** → Unlock Tier 3: Kissing love! 💋
- **Reach 500 clicks** → Unlock Tier 4: Orbital snakes! 🐍
- **Click "Emulate First Yes"** → Replay the experience (keeps your score)

## 🎮 How It Works

### The Journey

```
Start → Images Cycle (3s interval)
  ↓
Click "No" → Button grows → Pleading messages → Images change
  ↓
Click "Yes" → Love meter +1 → Otter floats up → Glow increases
  ↓
10 clicks → Tier 2: Sheep unlock! 🐑
  ↓
50 clicks → Tier 3: Kissing animation! 💋
  ↓
500 clicks → Tier 4: Orbital snakes! 🐍
  ↓
∞ clicks → Keep going! Each click shows new message
```

### State Persistence

Everything saves to localStorage:
- **Love meter count** - Persists across page reloads
- **Button size** - Remembers No clicks
- **Visual states** - Glow levels, max-size effects

## 🛠️ Customization

### Change Messages

Edit `js/config.js`:
```javascript
export const MESSAGES = {
    successSequence: [
        "Your custom message 1",
        "Your custom message 2",
        // ... add up to 20
    ]
}
```

### Change Love Tiers

Edit `js/config.js`:
```javascript
export const LOVE_TIERS = {
    tier1: { threshold: 15 },  // Change from 10
    tier2: { threshold: 75 }   // Change from 50
}
```

### Change Colors

Edit `css/components.css`:
```css
.btn-yes {
    background-color: #your-color;
}
```

### Change Cycling Speed

Edit `js/config.js`:
```javascript
export const IMAGE_CYCLE_INTERVAL = 5000; // 5 seconds
```

## 📁 Project Structure

```
hi_julia_1/
├── index.html                    # Main page (34 lines)
├── README.md                     # This file
├── CLAUDE.md                     # AI context for Claude
├── DEVELOPMENT.md                # Developer guide
├── .gitignore                    # Git exclusions
│
├── css/                          # Modular stylesheets
│   ├── main.css                  # Layout, glow, responsive
│   ├── components.css            # Buttons, UI, press effects
│   └── animations.css            # Keyframes, floating effects
│
├── js/                           # ES6 modules
│   ├── config.js                 # Constants (images, messages, tiers)
│   ├── state.js                  # State management, localStorage
│   ├── animations.js             # Visual effects (otters, glow)
│   └── handlers.js               # Event handlers, initialization
│
└── assets/images/
    ├── placeholders/             # Fallback images (tracked)
    └── custom/                   # Your photos (git-ignored)
        ├── cycling/              # 18 rotating images
        └── success/              # Success image
```

## 🔧 Technical Details

### Built With
- **Pure HTML5** - Semantic markup
- **CSS3** - Animations, transforms, flexbox
- **ES6 JavaScript** - Modules, classes, arrow functions
- **localStorage** - Client-side persistence

### No Dependencies
- No npm packages required
- No build process needed
- No frameworks or libraries
- Just open and run!

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

### Performance
- **60fps animations** - Uses transform/opacity
- **Lazy loading** - Success image loads on demand
- **Optimized images** - 18 photos ≈ 40MB total
- **Memory efficient** - Animations cleaned up after use

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~900 |
| HTML | 50 lines |
| CSS | 400 lines (3 files) |
| JavaScript | 450 lines (6 files) |
| Images | 19 (18 cycling + 1 success) |
| Love Tiers | 4 unlockable |
| Success Messages | 20 variations |
| Pleading Messages | 6 cycling |

## 🎯 Features Roadmap

- [x] Image cycling system
- [x] Love meter with persistence
- [x] Progressive glow effects
- [x] Love tier unlocks
- [x] Button size cap with effects
- [x] Tactile button feedback
- [x] Mobile optimization
- [x] Reset functionality
- [ ] Sound effects (optional)
- [ ] Confetti on milestones (optional)
- [ ] Share love count (optional)

## 🐛 Troubleshooting

### Images not showing?
1. Check file paths in `js/config.js`
2. Verify images exist in `cycling/` and `success/` folders
3. Check browser console for errors (F12)
4. Ensure filenames match exactly (case-sensitive)

### Love meter not saving?
1. Check browser allows localStorage
2. Not in incognito/private mode
3. Clear cache and reload
4. Check console for localStorage errors

### Animations laggy on mobile?
1. Reduce number of cycling images
2. Optimize image file sizes
3. Close other browser tabs
4. Ensure latest iOS/Android version

### Page scrolls on mobile?
- Should be fixed - ensure `overflow: hidden` in CSS
- Try hard refresh: Cmd+Shift+R (iOS) or Ctrl+Shift+R (Android)

## 📝 Version History

- **v7.0** (Current) - Tactile button press feedback
- **v6.0** - Button size cap with rainbow effects
- **v5.0** - Progressive glow effects
- **v4.0** - Love tiers system (sheep, kissing)
- **v3.0** - Image cycling (18 photos)
- **v2.0** - Modular refactoring
- **v1.0** - Initial single-file version

## 🤝 Contributing

This is a personal project, but suggestions welcome!
Open an issue or submit a PR.

## 📄 License

Personal project - Created with ❤️ for Julia
Not licensed for redistribution

## 💌 Credits

**Created by:** Boyfriend Manny
**Built for:** Girlfriend Julia
**Powered by:** Claude Sonnet 4.5
**Repository:** [github.com/felicisimo4/hi_julia_1](https://github.com/felicisimo4/hi_julia_1)

---

Made with 💖 and lots of code
