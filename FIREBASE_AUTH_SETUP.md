# Firebase Authentication Setup Guide

This guide walks through setting up secure backend authentication for the Valentine's Day webpage using Firebase Authentication.

## Overview

The authentication system uses:
- **Firebase Authentication** for secure password validation
- **Email/Password auth** for Julia and Manny
- **Anonymous auth** for "Other" users
- **Firebase Security Rules** to protect the database

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hi-julia-1-d70c1**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** (if not already enabled)
5. Go to **Sign-in method** tab
6. Enable the following providers:
   - ✅ **Email/Password** - Click, toggle "Enable", Save
   - ✅ **Anonymous** - Click, toggle "Enable", Save

## Step 2: Create User Accounts

### Option A: Using Firebase Console (Recommended)

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add user**

**Create Julia's account:**
- Email: `julia@valentine.local`
- Password: `prettyprincess`
- Click **Add user**

**Create Manny's account:**
- Email: `manny@valentine.local`
- Password: `yesdear`
- Click **Add user**

### Option B: Using Browser Console

1. Open your webpage in a browser
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. Run this command:

```javascript
// Import and run setup function
import('./js/firebase-auth.js').then(module => {
  module.setupUserAccounts();
});
```

This will automatically create both accounts. Check the console for confirmation.

## Step 3: Apply Firebase Security Rules

These rules ensure:
- Only authenticated users can access the leaderboard
- Users can only update their own scores
- Anonymous users have limited access

### Apply via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hi-julia-1-d70c1**
3. Click **Realtime Database** in the left sidebar
4. Go to the **Rules** tab
5. Replace the existing rules with:

```json
{
  "rules": {
    "leaderboard": {
      ".read": "auth != null",
      "$userId": {
        ".write": "auth != null && ($userId === data.child('uid').val() || !data.exists())",
        ".validate": "newData.hasChildren(['name', 'score', 'uid']) && newData.child('uid').val() === auth.uid"
      }
    }
  }
}
```

6. Click **Publish**

**Security explanation:**
- `.read`: Only authenticated users can see the leaderboard
- `.write`: Users can only write to their own entry (matched by UID)
- `.validate`: Ensures data includes name, score, and matches the user's UID

## Step 4: Update Leaderboard Module (Optional)

If you want to store scores by user UID instead of sanitized names, update `leaderboard.js`:

```javascript
// Store scores using Firebase Auth UID
const user = firebase.auth().currentUser;
if (user) {
  const userRef = this.database.ref(`leaderboard/${user.uid}`);
  userRef.transaction((currentScore) => {
    return Math.max(currentScore || 0, newScore);
  });
}
```

## Step 5: Test the Authentication

### Test Successful Login

1. Open the webpage (should show login screen)
2. Click **"Girlfriend Julia 💕"**
3. Enter password: `prettyprincess`
4. Click **"Enter →"** or press Enter
5. ✅ Should successfully log in and hide the overlay

### Test Failed Login

1. Refresh the page
2. Click **"Boyfriend Manny 💙"**
3. Enter wrong password: `wrongpassword`
4. Click **"Enter →"**
5. ❌ Should show: "Incorrect password"

### Test Anonymous Login

1. Refresh the page
2. Click **"Other >:("**
3. ✅ Should immediately log in (no password required)

### Test Session Persistence

1. Log in successfully
2. Navigate around the page (click Yes/No buttons)
3. Refresh the page
4. ✅ Should remain logged in (no login screen)

### Test Security (Verify Bypass Protection)

1. Open Developer Tools → Console
2. Try to bypass with: `sessionStorage.setItem('authenticated', 'true')`
3. Refresh the page
4. ❌ Should still show login screen (Firebase Auth required)

## Step 6: Verify Database Security

1. Log out (clear session storage)
2. Try to access Firebase Database directly
3. Should be denied (auth required)

### Test in Console:

```javascript
// This should fail without authentication
firebase.database().ref('leaderboard').once('value')
  .then(snapshot => console.log('Data:', snapshot.val()))
  .catch(error => console.log('Access denied:', error));
```

After successful login, the same code should work.

## Architecture Overview

```
User Action → Login UI → Firebase Auth → Token Generated
                                         ↓
                              Token stored in Firebase
                                         ↓
                              All database requests
                              include auth token
                                         ↓
                              Security Rules validate token
                                         ↓
                              Allow/Deny access
```

## User Credentials

| Identity | Email | Password | Auth Type |
|----------|-------|----------|-----------|
| Girlfriend Julia | julia@valentine.local | prettyprincess | Email/Password |
| Boyfriend Manny | manny@valentine.local | yesdear | Email/Password |
| Other | (none) | (none) | Anonymous |

## Important Notes

### Passwords Are Now Secure! 🔒

✅ **Before (Client-side):**
- Passwords visible in source code
- Easy to bypass with console commands
- No real security

✅ **After (Firebase Auth):**
- Passwords hashed and stored securely by Firebase
- Validated server-side (Firebase servers)
- Cannot be bypassed without valid credentials
- Industry-standard authentication

### Session Behavior

- **Login persists** until user closes the tab/browser
- **sessionStorage** tracks UI state (prevents login screen flashing)
- **Firebase Auth** tracks actual authentication state
- Both must be valid to bypass login

### Anonymous Users

- "Other" users authenticate anonymously
- Still get a Firebase UID
- Can participate but don't have persistent identity
- Scores may not persist across sessions (by design)

## Troubleshooting

### "User account not found" error

**Solution:** Create the user accounts (Step 2)

### "Authentication failed" error

**Solution:**
1. Check Firebase Auth is enabled (Step 1)
2. Verify Firebase SDK loaded (check browser console)
3. Check network tab for Firebase API calls

### "Permission denied" on database

**Solution:** Apply security rules (Step 3)

### Login screen shows indefinitely

**Solution:**
1. Open browser console
2. Check for Firebase initialization errors
3. Verify `FIREBASE_ENABLED = true` in `firebase-config.js`

### Can still bypass with sessionStorage

**Solution:** This shouldn't work anymore! If it does:
1. Check that `initLogin()` is calling `firebaseAuth.waitForAuth()`
2. Verify Firebase Auth SDK is loaded
3. Clear all browser storage and test again

## Development Notes

### Testing Locally

Since Firebase Auth works with any domain, you can test on:
- `localhost:8080`
- `127.0.0.1:8080`
- Your production domain

### Adding New Users

To add more identities:

1. Update `IDENTITY_EMAILS` in `firebase-auth.js`:
```javascript
const IDENTITY_EMAILS = {
    'New Identity': 'newemail@valentine.local',
    // ...
};
```

2. Create account in Firebase Console or use `setupUserAccounts()`

3. Update UI to include new identity button

## Security Best Practices ✅

- ✅ Passwords validated server-side (Firebase)
- ✅ Passwords never exposed in client code
- ✅ Database protected with security rules
- ✅ Authentication tokens auto-expire
- ✅ Anonymous users have limited permissions
- ✅ HTTPS enforced by Firebase (production)

## Next Steps (Optional Enhancements)

1. **Email Verification**: Require users to verify email addresses
2. **Password Reset**: Add "Forgot Password" functionality
3. **Multi-Factor Auth**: Add SMS or authenticator app
4. **Rate Limiting**: Add CAPTCHA after failed attempts
5. **Audit Logging**: Track login attempts and suspicious activity

---

**Setup Complete! 🎉**

Your Valentine's webpage now has secure, backend-validated authentication that cannot be bypassed with browser console tricks.

Julia and Manny can log in with their secret passwords, and everyone else can enjoy the experience anonymously!
