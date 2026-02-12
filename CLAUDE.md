# Claude Context File - Valentine's Day Interactive Webpage

## Project Overview
A feature-rich, gamified Valentine's Day webpage with progressive animations, love tiers, real-time leaderboards, and cross-device synchronization. Built by boyfriend Manny for girlfriend Julia using Firebase for global state management.

**Core Features:**
- Dual meter system: Total Love Meter (persistent) + Honeymoon Meter (session-based)
- Image cycling system (18 photos, manual control via No button)
- Four-tier animation system with unlockable milestones
- Firebase-powered leaderboard with 3 user identities
- Cross-device score synchronization
- Progressive visual effects (glow, color changes, snakes)
- Expandable tier progress dropdown
- Share functionality with Web Share API
- Emulation mode (replay experience while preserving score)
- Mobile-optimized for iPhone 16 Pro (no scrolling, touch-friendly)

## Project Structure

```
hi_julia_1/
├── index.html                    # Main HTML (72 lines, minimal markup)
├── README.md                     # User documentation (up to date)
├── CLAUDE.md                     # This file - AI context
├── DEVELOPMENT.md                # Developer onboarding guide
├── FIREBASE_SETUP.md             # Firebase setup instructions
├── .gitignore                    # Git exclusions
├── package.json                  # npm config (heic-convert only)
│
├── css/                          # Modular stylesheets (6 files)
│   ├── main.css                  # Layout, glow effects, responsive (178 lines)
│   ├── buttons.css               # All buttons, ripple, max-size (264 lines)
│   ├── meters.css                # Love/Honeymoon meters, colors (162 lines)
│   ├── leaderboard.css           # Leaderboard widget (90 lines)
│   ├── tier-hint.css             # Tier dropdown/dropup (148 lines)
│   └── animations.css            # Keyframes, snakes, floats (255 lines)
│
├── js/                           # ES6 modules (6 files)
│   ├── config.js                 # Constants (images, messages, tiers) (102 lines)
│   ├── state.js                  # ValentineState class, localStorage (115 lines)
│   ├── animations.js             # Visual effects (otters, snakes, glow) (179 lines)
│   ├── handlers.js               # Event handlers, initialization (317 lines)
│   ├── leaderboard.js            # Leaderboard + Firebase sync (252 lines)
│   └── firebase-config.js        # Firebase credentials (24 lines)
│
└── assets/images/
    ├── README.md                 # Asset upload instructions
    ├── placeholders/             # Fallback images (tracked)
    └── custom/                   # User photos (git-ignored)
        ├── cycling/              # 18 rotating images
        └── success/              # Success image after Yes
```

## Architecture

### State Management (state.js)
**ValentineState class** - Single source of truth for application state:
```javascript
{
  loveCount: 0,           // Total Yes clicks (persistent, syncs via Firebase)
  honeymoonCount: 0,      // Session Yes clicks (resets on emulation)
  noClickCount: 0,        // No clicks (controls button growth)
  yesPadding: 12,         // Current Yes button padding
  yesFontSize: 16,        // Current Yes button font size
  messageIndex: 0,        // Current pleading message index
  currentImageIndex: 0    // Current cycling image index
}
```

**Key Methods:**
- `loadLoveCount()` - Loads from localStorage, recalculates button size
- `incrementLove()` - Increments both loveCount and honeymoonCount
- `resetHoneymoon()` - Resets honeymoon counter (for emulation)
- `growButton()` - Grows Yes button, caps at max, returns atMaxSize flag
- `getHoneymoonCount()` - Returns current session counter

### Dual Meter System

**Total Love Meter (Persistent):**
- Tracks lifetime Yes clicks across all sessions and devices
- Syncs to Firebase under user's identity (Girlfriend Julia, Boyfriend Manny, or Other)
- Displayed in top-right corner
- Color changes at thresholds: 10, 50, 500 clicks
- Never resets (unless user manually clears data)

**Honeymoon Meter (Temporary):**
- Tracks Yes clicks in current session only
- Resets when "Emulate First Yes" is clicked
- Displayed below Total Love Meter
- Golden theme (🍯 honey icon)
- Used to detect if user has clicked Yes in current session (honeymoonCount === 0)

### Firebase Integration (leaderboard.js)

**Architecture:**
- Real-time database sync via Firebase Realtime Database
- Leaderboard stored at `/leaderboard/{sanitized_user_name}`
- Transaction-based score updates (atomic, prevents race conditions)
- Fallback to localStorage if Firebase unavailable

**Three User Identities:**
1. **Girlfriend Julia** - Primary user
2. **Boyfriend Manny** - Secondary user
3. **Other >:(** - Everyone else

**Identity Selection:**
- Prompt on first visit: "Who are you? 💕"
- Stored in localStorage as 'userIdentity'
- Used as key in leaderboard and Firebase

**Cross-Device Sync:**
- On page load: Fetches user's score from Firebase
- Compares with local localStorage score
- Uses `Math.max()` to preserve highest score
- Auto-updates localStorage if Firebase has higher score
- Auto-updates Firebase if local has higher score
- `loveCountSync` event dispatched when sync occurs
- Handlers listen to event and update all UI elements

**Real-Time Updates:**
- Firebase listener on `/leaderboard` node
- Updates leaderboard display when any user's score changes
- Triggers UI refresh via `leaderboardUpdate` custom event

### Configuration (config.js)

**IMAGES:**
- `defaultImages[]` - Array of 18 cycling image paths
- `success` - Success image shown after first Yes
- `defaultFallback` - Placeholder URL if images missing

**MESSAGES:**
- `initial` - "Will you be my valentine this year?"
- `successSequence[]` - 20 escalating romantic messages
- `pleading[]` - 6 messages cycling on No clicks

**LOVE_TIERS:**
- `tier1: 10 clicks` - Sheep unlock (displayed as "Tier 2" to users)
- `tier2: 50 clicks` - Kissing animation (displayed as "Tier 3")
- `tier3: 500 clicks` - Orbital snakes (displayed as "Tier 4")
- Tier naming: Internal 0-indexed (tier1,tier2,tier3), User-facing 1-indexed (Tier 2,3,4)
- Base tier (1-9 clicks) is "Tier 1" for users but has no explicit config

**BUTTON_GROWTH:**
- `maxPadding: 40` - Button stops growing at this padding
- `maxFontSize: 32` - Font size cap
- At max: Rainbow gradient, glow effects, shake animation

**USER_IDENTITIES:**
- `JULIA`: 'Girlfriend Julia'
- `MANNY`: 'Boyfriend Manny'
- `OTHER`: 'Other >:('

### Visual Effects System

**Total Love Meter Color Progression (4 levels):**
```javascript
data-love-level="0"  // 0-9 clicks: White background
data-love-level="1"  // 10-49 clicks: Light pink gradient
data-love-level="2"  // 50-499 clicks: Hot pink gradient, glow pulse
data-love-level="3"  // 500+ clicks: Rainbow gradient, intense glow
```

**Container Glow (4 levels):**
```javascript
data-love-glow="0"  // 0 clicks: No glow
data-love-glow="1"  // 1-9 clicks: Gentle red glow, 3s pulse
data-love-glow="2"  // 10-49 clicks: Medium pink glow, 2.5s pulse
data-love-glow="3"  // 50+ clicks: Maximum radiance, 2s pulse
```

**Animation Tiers (User-Facing Tier Numbers):**
```javascript
Tier 1 (1-9 clicks):    createFloatingOtter(button)
Tier 2 (10-49 clicks):  createFloatingOtterAndSheep(button)
Tier 3 (50-499 clicks): createKissingLove(button) // 🐑💋🦦 with spin
Tier 4 (500+ clicks):   createOrbitalSnake() + createKissingLove(button)
```

**Orbital Snakes (500+ clicks):**
- Two snakes spawn per Yes click
- Left-to-right snake: Starts from left, arcs upward, exits right (8s duration)
- Right-to-left snake: Starts from right (2s delayed), arcs upward, exits left
- Orbital motion: Bottom → Arc peak → Bottom
- Mobile-optimized with lower arc heights

**Button States:**
```javascript
yesPadding < 40:   Normal growth on No clicks
yesPadding >= 40:  Add .max-size class
                   → Rainbow gradient animation
                   → Pulsing glow (rainbowGlow keyframe)
                   → Shake animation (buttonShake keyframe)
                   → Gradient flow (gradientFlow keyframe)
```

### Image Cycling System

**Three Modes:**

1. **Initial Auto-Cycle (First Visit):**
   - Starts when `loveCount === 0`
   - 18 images rotate every 3 seconds (IMAGE_CYCLE_INTERVAL)
   - Random starting image
   - Stops on first Yes click

2. **Manual Cycling (Emulation Mode):**
   - Triggered by "Emulate First Yes" button
   - Shows random starting image (no timer)
   - Images change only when No button clicked
   - Active when `honeymoonCount === 0`
   - Gives user control to replay experience

3. **Static Success Image (After Yes):**
   - Once Yes is clicked, auto-cycling stops permanently
   - Success image displayed
   - No further cycling (unless emulating)

**Image Control Logic:**
```javascript
// In handleNo():
if (state.honeymoonCount === 0) {
    cycleImages(); // Manual cycle to next image
}
```

### Expandable Tier Hint Dropdown

**Location:** Bottom-left corner

**Features:**
- Click header to expand/collapse
- Arrow rotates: ▲ (collapsed) → ▼ (expanded)
- Smooth max-height animation (expands upward = "dropup")
- Header text changes based on progress:
  - < 10: "Surprise awaits at 10 clicks! 🎁"
  - < 50: "Surprise awaits at 50 clicks! 💋"
  - < 500: "Surprise awaits at 500 clicks! 🐍"
  - >= 500: "You've unlocked all surprises! 👑"

**Tier List Display:**
- Shows all 3 unlockable tiers with 1-indexed numbers:
  - 🐑 Tier 2: Sheep Unlocked (unlock at 10)
  - 💋 Tier 3: Kissing Love (unlock at 50)
  - 🐍 Tier 4: Snake Paradise (unlock at 500)
- Unlocked tiers: Green text, ✓ checkmark, full-color icons
- Locked tiers: Gray text, 🔒 lock, grayscale icons, "(unlock at X)" hint

### Emulate First Yes Feature

**Button:** Bottom-right corner ("Emulate First Yes")

**Purpose:** Replay the initial experience without losing progress

**Behavior:**
1. Confirms with user: "Experience the first Yes again? Your leaderboard score will be kept!"
2. Resets honeymoon meter to 0 (temporary counter)
3. Resets UI to initial state:
   - Button size back to normal
   - Messages back to "Will you be my valentine this year?"
   - Random starting image (no auto-cycling)
   - Glow effects reset to Level 0
4. Preserves Total Love Meter (loveCount stays at current value)
5. Preserves leaderboard score
6. Next Yes click increments BOTH meters (loveCount + honeymoonCount)
7. Images cycle manually on No button press (honeymoonCount === 0)

**Use Case:** User wants to show their girlfriend the experience again without resetting their high score

### Share Functionality

**Button:** 📤 icon in Total Love Meter widget

**Behavior:**
1. **Web Share API (Mobile):**
   - Shares title, text, and URL via native share sheet
   - Title: "For Girlfriend Julia :3"
   - Text: "{User} has {loveCount} love points! 💕 Can you beat my score?"

2. **Clipboard Fallback (Desktop):**
   - Copies share text + URL to clipboard
   - Shows alert: "Link copied to clipboard! 📋 Share it with Julia! 💕"

3. **Final Fallback:**
   - Shows prompt with URL if clipboard fails

## Key Implementation Details

### localStorage Keys
```javascript
'loveCount'       // Total Yes clicks (persistent)
'noClickCount'    // No clicks (button growth)
'userIdentity'    // User's identity choice
'leaderboard'     // Cached leaderboard scores
```

### Firebase Database Structure
```javascript
{
  leaderboard: {
    "Girlfriend_Julia": 42,
    "Boyfriend_Manny": 31,
    "Other____": 15
  }
}
```

### Custom Events
```javascript
'leaderboardUpdate'  // Fired when Firebase updates leaderboard
'loveCountSync'      // Fired when love count syncs from Firebase
                     // detail: { count: syncedScore }
```

### Button Growth Tracking
- `noClickCount` tracks No clicks (not love count!)
- Button size: `initialSize + (noClickCount * increment)`
- Must reload from localStorage on page load
- Capped at `maxPadding` and `maxFontSize`
- Preserved during emulation (UI state reset doesn't affect No clicks)

### Mobile Optimization (iPhone 16 Pro)

**Viewport:** 393px width
- `viewport-fit=cover` for Dynamic Island
- `safe-area-inset` padding for notch
- No scrolling: `overflow: hidden; position: fixed`
- Container: 16px margins, calc(100% - 32px) width
- Dynamic viewport height: `100dvh` (accounts for browser chrome)
- Images capped at 40vh height
- Touch targets: 44px minimum (Apple guideline)
- Gentler glow effects (50% intensity of desktop)
- Smaller fonts and tighter spacing

**Padding System:**
- Body: 16px horizontal margins
- Container: 20px internal padding, 12px border-radius
- Creates breathing room around content
- Prevents cluttered mobile layout

## Common Tasks

### Add New Success Message
1. Edit `js/config.js` → `MESSAGES.successSequence[]`
2. Messages display based on click count: `successSequence[loveCount - 1]`
3. Currently 20 messages, loops back to last one after

### Add New Love Tier
1. Edit `js/config.js` → Add `tier4` to `LOVE_TIERS`
2. Edit `js/handlers.js` → Update `handleYes()` conditionals
3. Edit `js/animations.js` → Create new animation function
4. Edit `css/animations.css` → Add animation keyframes
5. Edit `js/handlers.js` → Update `updateLoveTierHint()` tier list

### Change Button Size Cap
1. Edit `js/config.js` → `BUTTON_GROWTH.maxPadding` and `maxFontSize`
2. Button will stop growing at these values
3. Visual effects trigger when at max

### Change Total Love Meter Colors
1. Edit `css/meters.css` → Add/modify `[data-love-level="N"]` selectors
2. Edit `js/animations.js` → Update `updateLoveMeterColor()` thresholds

### Add New Glow Level
1. Edit `css/main.css` → Add `[data-love-glow="4"]` selector
2. Edit `js/animations.js` → Update `updateLoveGlow()` logic
3. Define box-shadow layers and animation

### Modify Firebase Structure
1. Edit `js/firebase-config.js` → Update `firebaseConfig`
2. Edit `js/leaderboard.js` → Update database ref paths
3. Update Firebase security rules in console

## Testing Checklist

**Functionality:**
- [ ] Images cycle every 3s on first visit
- [ ] Images cycle manually on No button during emulation
- [ ] Yes button: increments both meters, shows animation, changes message
- [ ] No button: grows Yes button, shows pleading message
- [ ] Tier 2 (10 clicks): sheep appear with otter
- [ ] Tier 3 (50 clicks): kissing animation with spin
- [ ] Tier 4 (500 clicks): orbital snakes + kissing
- [ ] Total Love Meter persists after page reload
- [ ] Honeymoon Meter resets on emulation
- [ ] Emulate button preserves Total Love Meter

**Visual Effects:**
- [ ] Container glow intensifies with love count (4 levels)
- [ ] Total Love Meter changes color at 10, 50, 500
- [ ] Yes button caps at max size, adds rainbow effects
- [ ] Button press feels tactile (sink down, ripple)
- [ ] Tier hint updates correctly, dropdown expands/collapses
- [ ] Success messages cycle through 20 variations

**Firebase & Cross-Device:**
- [ ] Leaderboard syncs across devices in real-time
- [ ] User identity persists across sessions
- [ ] Love count syncs to highest value on page load
- [ ] Share button works (Web Share API or clipboard)
- [ ] Same user sees same score on mobile and desktop

**Mobile (iPhone 16 Pro):**
- [ ] No scrolling (page locked to viewport)
- [ ] Container has padding, not edge-to-edge
- [ ] All elements visible and not cluttered
- [ ] Touch targets easily tappable (44px min)
- [ ] Glow effects not overwhelming
- [ ] Animations smooth at 60fps
- [ ] Safe area insets respected (no overlap with notch)

## File Dependencies

```
index.html
  ├─> css/main.css
  ├─> css/buttons.css
  ├─> css/meters.css
  ├─> css/leaderboard.css
  ├─> css/tier-hint.css
  ├─> css/animations.css
  ├─> Firebase SDK (CDN)
  └─> js/handlers.js (type="module")
       ├─> js/config.js
       ├─> js/state.js
       ├─> js/animations.js
       └─> js/leaderboard.js
            └─> js/firebase-config.js
```

**Import chain:**
- `handlers.js` imports everything
- `leaderboard.js` imports Firebase config
- Other modules export functions/constants
- No circular dependencies

## Performance Considerations

**Animation Performance:**
- Use `transform` and `opacity` for 60fps (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly (only during animation)
- Clean up animations: `setTimeout(() => element.remove())`

**Firebase Optimization:**
- Transactions prevent race conditions on score updates
- Single listener on `/leaderboard` (not per-user)
- localStorage cache reduces Firebase reads
- `.once()` for initial sync, `.on()` for real-time updates

**Image Loading:**
- 18 cycling images loaded upfront (≈40MB total)
- Success image lazy-loaded on first Yes
- Fallback chain: custom → placeholder URL

**Memory Management:**
- Floating animations auto-remove after 3-8 seconds
- Event listeners properly attached once in init()
- No memory leaks from uncleared intervals (stopImageCycling cleans up)

## Important Notes

### Image Paths
- Always use relative paths: `./assets/images/...`
- Fallback system: Try custom image first, then placeholder
- `swapImage()` handles fallback via `img.onerror`

### Firebase Security
- Database rules should restrict writes to authenticated users (production)
- Current config: Open for demo purposes
- Sanitize user identity keys: `replace(/[.#$\/\[\]]/g, '_')`

### State Synchronization
- Love count syncs on page load (Firebase → localStorage)
- Leaderboard updates in real-time (Firebase listener)
- Button size persists independently (noClickCount)
- Honeymoon meter is session-only (never syncs to Firebase)

### Tier Numbering Convention
- **Internal (code):** 0-indexed (tier1, tier2, tier3)
- **User-facing (UI):** 1-indexed (Tier 1, 2, 3, 4)
- Base tier (1-9 clicks) = Tier 1 for users, no explicit config
- Unlockable tiers start at Tier 2 (10 clicks)

## Version History

- **v10.0** (Current) - CSS refactor (split components.css into 4 files)
- **v9.0** - README updated with Tier 4, 1-indexed tier numbering
- **v8.0** - Image cycling controlled by No button in emulation mode
- **v7.5** - Mobile padding improvements (container breathing room)
- **v7.0** - Expandable tier hint dropdown with all tiers
- **v6.5** - Cross-device love count synchronization via Firebase
- **v6.0** - Total Love Meter color progression, Tier 3 snakes at 500 clicks
- **v5.5** - Honeymoon Meter for emulation sessions
- **v5.0** - Firebase integration, leaderboard, share button
- **v4.5** - Emulate First Yes functionality
- **v4.0** - Love tiers system (sheep at 10, kissing at 50)
- **v3.0** - Image cycling (18 photos)
- **v2.0** - Modular refactoring
- **v1.0** - Initial single-file version

## Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~1,700 |
| HTML | 72 lines |
| CSS | 1,097 lines (6 files) |
| JavaScript | 989 lines (6 files) |
| Documentation | 1,400+ lines (4 files) |
| Images | 19 (18 cycling + 1 success) |
| Love Tiers | 4 unlockable (3 configs) |
| Success Messages | 20 variations |
| Pleading Messages | 6 cycling |
| User Identities | 3 choices |
| CSS Files | 6 modular files |
| JS Modules | 6 ES6 modules |

## Contact

**Created by:** Boyfriend Manny
**Built for:** Girlfriend Julia
**Powered by:** Claude Sonnet 4.5
**Repository:** [github.com/felicisimo4/hi_julia_1](https://github.com/felicisimo4/hi_julia_1)

---

Last updated: February 2026 (v10.0 - CSS Refactor)
