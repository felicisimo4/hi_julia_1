# Development Guide

## Quick Start

1. **No build process required** - Pure HTML/CSS/JS
2. **No dependencies** - No npm packages (except dev tools for HEIC conversion)
3. **Just open** `index.html` in a browser

## Development Setup

### Local Development
```bash
# Simple HTTP server (optional, for testing)
python -m http.server 8000
# OR
npx http-server

# Open browser
open http://localhost:8000
```

### Testing on Mobile
```bash
# Get your local IP
ifconfig | grep "inet "

# Access from phone on same network
http://192.168.x.x:8000
```

## Code Style Guide

### JavaScript
- **ES6 modules** - Use import/export
- **Named exports** - `export function foo() {}`
- **Const by default** - Use `const` unless reassignment needed
- **Clear names** - `updateLoveGlow()` not `updateGlow()`
- **Single responsibility** - Each function does one thing
- **Comments** - Only for non-obvious logic

### CSS
- **Mobile-first** - Base styles, then `@media` for larger screens
- **BEM-lite** - `.btn-yes`, `.love-meter-count` (no strict BEM)
- **Semantic names** - `.max-size` not `.big-button`
- **Grouped by purpose** - Animations together, components together
- **No !important** - Except for overriding animations

### HTML
- **Semantic tags** - Use `<button>`, not `<div onclick>`
- **IDs for JS** - `id="yesButton"` for JavaScript access
- **Classes for CSS** - `class="btn-yes"` for styling
- **Data attributes** - `data-love-glow="2"` for state

## File Organization Rules

### CSS Files
- **main.css** - Layout, body, container, global styles, responsive
- **components.css** - Buttons, love meter, hints, UI widgets
- **animations.css** - @keyframes only, animation classes

### JavaScript Files
- **config.js** - Constants only, no logic
- **state.js** - State class and management only
- **animations.js** - Visual effects functions only
- **handlers.js** - Event handlers and initialization only

**Rule:** If a file grows beyond 150 lines, consider splitting.

## Adding New Features

### Adding a New Animation

1. **Create animation function** in `js/animations.js`:
```javascript
export function createNewAnimation(element) {
    const animElement = document.createElement('div');
    animElement.className = 'new-animation';
    animElement.textContent = '✨';
    // Position and append
    document.body.appendChild(animElement);
    setTimeout(() => animElement.remove(), 3000);
}
```

2. **Add CSS animation** in `css/animations.css`:
```css
.new-animation {
    position: fixed;
    animation: newEffect 3s ease-out forwards;
}

@keyframes newEffect {
    0% { /* start state */ }
    100% { /* end state */ }
}
```

3. **Import and use** in `js/handlers.js`:
```javascript
import { createNewAnimation } from './animations.js';
// Call in appropriate handler
```

### Adding a New Love Tier

1. **Add tier config** in `js/config.js`:
```javascript
export const LOVE_TIERS = {
    // ... existing tiers
    tier3: {
        threshold: 100,
        name: 'Ultimate Love',
        hint: 'Surprise awaits at 100 clicks! 💎'
    }
}
```

2. **Add animation logic** in `js/handlers.js`:
```javascript
export function handleYes() {
    // ... existing code
    if (newCount >= LOVE_TIERS.tier3.threshold) {
        createNewTierAnimation(yesButton);
    } else if (newCount >= LOVE_TIERS.tier2.threshold) {
        // ... tier 2
    }
    // ... rest
}
```

3. **Update hint display** in `updateLoveTierHint()`:
```javascript
else if (loveCount < LOVE_TIERS.tier3.threshold) {
    hintElement.textContent = LOVE_TIERS.tier3.hint;
}
```

### Adding a New Success Message Theme

1. **Add messages** to `js/config.js`:
```javascript
successSequence: [
    // ... existing 20 messages
    "Message 21",
    "Message 22",
    // Add as many as you want
]
```

Messages automatically cycle based on `loveCount - 1` index.

## State Management

### Reading State
```javascript
import { state } from './state.js';

const currentLove = state.loveCount;
const buttonSize = state.yesPadding;
```

### Modifying State
```javascript
// Good - use state methods
state.incrementLove();
state.growButton();
state.reset();

// Bad - direct modification
state.loveCount++; // Don't do this!
```

### localStorage Sync
State automatically syncs to localStorage:
- `loveCount` saved on every `incrementLove()`
- `noClickCount` saved on every `growButton()`
- Load on init with `loadLoveCount()`
- Clear on `reset()`

## Performance Optimization

### Animation Performance
```javascript
// Good - Use transform/opacity
element.style.transform = 'translateY(-200px)';
element.style.opacity = '0';

// Bad - Use top/left/width/height
element.style.top = '-200px'; // Causes reflow!
```

### Memory Management
```javascript
// Always clean up animations
setTimeout(() => {
    element.remove(); // Remove from DOM
}, 3000);

// Clear intervals
clearInterval(imageCycleInterval);
imageCycleInterval = null;
```

### Image Optimization
- Keep images under 2MB each
- Use JPG for photos (not PNG)
- Already optimized: 18 images = ~40MB total
- Lazy loading not needed (only success image lazy)

## Debugging

### Common Issues

**Images not showing:**
```javascript
// Check fallback chain
console.log(IMAGES.defaultImages[0]); // Path correct?
// Check browser console for 404 errors
// Verify image exists in cycling/ folder
```

**Button not growing:**
```javascript
// Check noClickCount
console.log(state.noClickCount);
// Check if at max size
console.log(state.yesPadding, BUTTON_GROWTH.maxPadding);
```

**Love meter not persisting:**
```javascript
// Check localStorage
console.log(localStorage.getItem('loveCount'));
// Verify saveLoveCount() is called
```

**Animations not appearing:**
```javascript
// Check CSS class applied
console.log(element.className);
// Check z-index (should be 1000)
// Check element is appended to body
console.log(document.body.contains(element));
```

### Debug Mode
Add to `handlers.js` for debugging:
```javascript
const DEBUG = true;

if (DEBUG) {
    console.log('Love count:', state.loveCount);
    console.log('Glow level:', container.dataset.loveGlow);
}
```

## Testing

### Manual Test Script

1. **Initial State:**
   - [ ] Images cycle every 3s
   - [ ] Love meter shows 0
   - [ ] Hint says "Surprise awaits at 10 clicks"

2. **Click No (x7):**
   - [ ] Yes button grows each click
   - [ ] Pleading messages cycle
   - [ ] Button reaches max size
   - [ ] Rainbow effects appear

3. **Click Yes (x1):**
   - [ ] Love meter shows 1
   - [ ] Otter floats up
   - [ ] Success image appears
   - [ ] Message changes
   - [ ] Glow level 1 activates

4. **Click Yes (x9 more = 10 total):**
   - [ ] Love meter shows 10
   - [ ] Sheep appear with otters
   - [ ] Hint changes to "50 clicks"
   - [ ] Glow level 2 activates

5. **Click Yes (x40 more = 50 total):**
   - [ ] Love meter shows 50
   - [ ] Kissing animation appears
   - [ ] Hint changes to "unlocked all"
   - [ ] Glow level 3 (maximum)

6. **Reload page:**
   - [ ] Love meter shows 50
   - [ ] Button size preserved
   - [ ] Success image shows
   - [ ] Glow level 3 active

7. **Click Reset:**
   - [ ] Confirmation dialog
   - [ ] After confirm: everything resets
   - [ ] Page reloads clean

### Browser Testing

**Desktop:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile:**
- iPhone 16 Pro Safari (primary target)
- iPhone 13 Safari
- Android Chrome

## Git Workflow

### Branching
```bash
git checkout -b feature/new-animation
# Make changes
git add .
git commit -m "Add sparkle animation at tier 3"
git push origin feature/new-animation
```

### Commit Messages
Format: `<type>: <description>`

Types:
- `feat:` New feature
- `fix:` Bug fix
- `style:` CSS/visual changes
- `refactor:` Code restructure
- `docs:` Documentation
- `perf:` Performance improvement

Examples:
```
feat: Add tier 3 diamond animation at 100 clicks
fix: Prevent button growth beyond container width
style: Improve mobile button press animation
refactor: Extract glow logic to separate function
```

### Co-Authored Commits
Always include:
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Deployment

### GitHub Pages
```bash
# Already configured in settings
# Push to main → auto-deploys
git push origin main

# Access at:
# https://felicisimo4.github.io/hi_julia_1/
```

### Custom Domain (Optional)
1. Add CNAME file with domain
2. Configure DNS A records
3. Enable HTTPS in GitHub settings

## Troubleshooting

### "Module not found" error
- Ensure `type="module"` in script tag
- Check import paths (relative: `./state.js`)
- Verify file exists in correct location

### Animations lag on mobile
- Reduce glow layers in mobile media query
- Decrease animation complexity
- Use `will-change` sparingly
- Check for 60fps in Chrome DevTools

### localStorage not working
- Check browser privacy settings
- Incognito mode disables localStorage
- Check for quota exceeded (rare)
- Verify localStorage.setItem() called

### Images not loading
- Check file paths (case-sensitive!)
- Verify files exist in cycling/ folder
- Check browser console for 404
- Test fallback URL works

## Resources

- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)
- [Can I Use](https://caniuse.com) - Browser compatibility
- [iPhone Viewport Sizes](https://www.ios-resolution.com)

## License

Personal project - Not licensed for redistribution
Created with ❤️ for Girlfriend Julia
