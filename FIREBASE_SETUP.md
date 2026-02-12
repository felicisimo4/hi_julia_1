# Firebase Setup Guide

## 🔥 Get Your Global Leaderboard Working!

Currently, the leaderboard only works locally (per browser). Follow these steps to enable a **global leaderboard** where Julia and Manny can compete across all devices!

---

## 📋 Step-by-Step Setup (5 Minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** (or use existing project)
3. Enter project name: `valentine-leaderboard` (or any name)
4. Disable Google Analytics (not needed)
5. Click **"Create project"**
6. Wait for setup to complete
7. Click **"Continue"**

### Step 2: Add Web App

1. In Firebase Console, click the **Web icon** (`</>`)
2. App nickname: `Valentine's Day Webpage`
3. **Check** "Also set up Firebase Hosting" (optional, skip if you want)
4. Click **"Register app"**
5. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "valentine-leaderboard.firebaseapp.com",
  databaseURL: "https://valentine-leaderboard-default-rtdb.firebaseio.com",
  projectId: "valentine-leaderboard",
  storageBucket: "valentine-leaderboard.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Click **"Continue to console"**

### Step 3: Enable Realtime Database

1. In left sidebar, click **"Realtime Database"**
2. Click **"Create Database"**
3. **Select location:** Choose closest to you (e.g., `us-central1`)
4. **Security rules:** Choose **"Start in test mode"** (we'll secure it in Step 5)
5. Click **"Enable"**

Your database URL will be shown at the top (e.g., `https://valentine-leaderboard-default-rtdb.firebaseio.com`)

### Step 4: Update Your Code

1. Open `js/firebase-config.js` in your project
2. **Replace** the placeholder config with YOUR config from Step 2:

```javascript
export const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",           // Replace this
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};
```

3. **Change** `FIREBASE_ENABLED` to `true`:

```javascript
export const FIREBASE_ENABLED = true;
```

4. **Save** the file

### Step 5: Set Security Rules (Important!)

1. In Firebase Console → **Realtime Database** → **Rules** tab
2. **Replace** the rules with this:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true,
      "$user": {
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    }
  }
}
```

3. Click **"Publish"**

**What these rules do:**
- Anyone can read the leaderboard ✅
- Anyone can write scores ✅
- Scores must be positive numbers ✅
- Prevents malicious data

### Step 6: Test It!

1. Open your webpage
2. Open browser console (F12)
3. You should see: `"Firebase initialized successfully!"`
4. Click "Yes" a few times
5. Check Firebase Console → Realtime Database → Data tab
6. You should see:

```
leaderboard
  ├─ Girlfriend_Julia: 5
  ├─ Boyfriend_Manny: 0
  └─ Other_____: 0
```

7. **Open on another device** → Scores sync in real-time! 🎉

---

## ✅ What You Get

**Global Leaderboard:**
- Julia's phone → Updates Manny's desktop instantly
- Real competition across all devices
- Scores persist forever
- Real-time updates (see changes live!)

**Example:**
```
🏆 Leaderboard (Live!)
────────────────────────
🥇 Girlfriend Julia  127 💕
🥈 Boyfriend Manny    89 💕
🥉 Other >:(          12 💕
```

---

## 🔧 Troubleshooting

### "Firebase is not defined"
- Check that Firebase SDK loaded in `index.html`
- Check browser console for errors
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "Permission denied"
- Check Firebase security rules (Step 5)
- Make sure rules allow read/write
- Publish the rules

### "No data showing up"
- Check `FIREBASE_ENABLED = true` in `firebase-config.js`
- Check `databaseURL` in config is correct
- Check Firebase Console → Database → Data tab

### Scores not updating
- Check browser console for errors
- Verify Firebase config is correct
- Make sure you're online
- Check Firebase quota (should be fine, free tier is 1GB)

---

## 📊 Firebase Free Tier Limits

**You get for FREE:**
- 1 GB stored data
- 10 GB/month downloaded
- 100 simultaneous connections

**Your usage:** ~1 KB (way under limits!)
- 3 users × 1 number each = tiny data
- Even with 1000 visitors, still under limits

**Conclusion:** Will never cost money for this use case! 🎉

---

## 🔒 Security Notes

**Current setup:**
- ✅ Anyone can read leaderboard (see scores)
- ✅ Anyone can update their own score
- ⚠️ Could technically manipulate scores (but who cares, it's just for fun!)

**If you want stricter security:**
Add authentication (more complex):
1. Enable Firebase Auth
2. Require login
3. Secure rules to only allow user to update their own score

**For this use case:** Current security is fine! It's a fun Valentine's page, not a bank! 💕

---

## 🚀 Advanced: Deploy to Firebase Hosting (Optional)

If you also want to host the page on Firebase:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

Your page will be at: `https://YOUR_PROJECT.firebaseapp.com`

---

## 📝 Quick Reference

**Files modified:**
- `js/firebase-config.js` - Your Firebase credentials
- `js/leaderboard.js` - Firebase integration
- `index.html` - Firebase SDK loaded

**What to change:**
1. Replace config in `firebase-config.js`
2. Set `FIREBASE_ENABLED = true`
3. Set security rules in Firebase Console

**Test checklist:**
- [ ] Console shows "Firebase initialized successfully!"
- [ ] Clicking Yes updates leaderboard
- [ ] Firebase Console → Data shows scores
- [ ] Opening on another device shows same scores
- [ ] Real-time: One device updates, other sees change instantly

---

## 💡 Need Help?

Check browser console (F12) for error messages. Most issues are:
1. Wrong config (copy-paste error)
2. `FIREBASE_ENABLED` still false
3. Security rules not published

Good luck! 🔥💕
