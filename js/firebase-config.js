// Firebase Configuration
// Replace with your actual Firebase config from Firebase Console

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Set to true once you've added your Firebase config
export const FIREBASE_ENABLED = false;

// Instructions to get your config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Click "Add app" → Web (</> icon)
// 4. Copy the config object
// 5. Paste it above (replace the placeholder values)
// 6. Set FIREBASE_ENABLED = true
// 7. Save this file
