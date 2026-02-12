// Leaderboard management

import { USER_IDENTITIES } from './config.js';
import { firebaseConfig, FIREBASE_ENABLED } from './firebase-config.js';

class LeaderboardManager {
    constructor() {
        this.currentUser = null;
        this.scores = this.loadScores();
        this.firebaseInitialized = false;
        this.database = null;
        this.initFirebase();
    }

    // Initialize Firebase
    initFirebase() {
        if (!FIREBASE_ENABLED) {
            console.log('Firebase disabled - using localStorage only');
            return;
        }

        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK not loaded');
                return;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.database = firebase.database();
            this.firebaseInitialized = true;
            console.log('Firebase initialized successfully!');

            // Set up real-time listener
            this.listenToFirebase();
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            console.log('Falling back to localStorage');
        }
    }

    // Listen for real-time updates from Firebase
    listenToFirebase() {
        if (!this.firebaseInitialized) return;

        this.database.ref('leaderboard').on('value', (snapshot) => {
            const firebaseScores = snapshot.val();
            if (firebaseScores) {
                this.scores = firebaseScores;
                // Also update localStorage cache
                localStorage.setItem('leaderboard', JSON.stringify(firebaseScores));
                // Update UI
                const event = new CustomEvent('leaderboardUpdate');
                window.dispatchEvent(event);
            }
        });
    }

    // Load scores from localStorage
    loadScores() {
        const saved = localStorage.getItem('leaderboard');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with default scores
        return {
            [USER_IDENTITIES.JULIA]: 0,
            [USER_IDENTITIES.MANNY]: 0,
            [USER_IDENTITIES.OTHER]: 0
        };
    }

    // Save scores to localStorage and Firebase
    saveScores() {
        // Always save to localStorage (instant, works offline)
        localStorage.setItem('leaderboard', JSON.stringify(this.scores));

        // Also save to Firebase if enabled
        if (this.firebaseInitialized) {
            this.database.ref('leaderboard').set(this.scores)
                .then(() => {
                    console.log('Scores synced to Firebase!');
                })
                .catch((error) => {
                    console.error('Firebase sync failed:', error);
                });
        }
    }

    // Get current user identity
    getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        const saved = localStorage.getItem('userIdentity');
        if (saved) {
            this.currentUser = saved;
            return saved;
        }

        // Prompt user to identify themselves
        return this.promptUserIdentity();
    }

    // Prompt user to choose identity
    promptUserIdentity() {
        const message = "Who are you? 💕\n\n1️⃣ Girlfriend Julia\n2️⃣ Boyfriend Manny\n3️⃣ Other >:(";
        const choice = prompt(message + "\n\nEnter 1, 2, or 3:");

        let identity;
        switch(choice) {
            case '1':
                identity = USER_IDENTITIES.JULIA;
                break;
            case '2':
                identity = USER_IDENTITIES.MANNY;
                break;
            case '3':
            default:
                identity = USER_IDENTITIES.OTHER;
                break;
        }

        this.currentUser = identity;
        localStorage.setItem('userIdentity', identity);
        return identity;
    }

    // Update score for current user
    updateScore(newScore) {
        const user = this.getCurrentUser();
        const oldScore = this.scores[user] || 0;

        // Only update if new score is higher
        if (newScore > oldScore) {
            this.scores[user] = newScore;

            // Save to localStorage immediately
            localStorage.setItem('leaderboard', JSON.stringify(this.scores));

            // Use Firebase transaction for atomic update
            if (this.firebaseInitialized) {
                const userKey = this.sanitizeKey(user);
                this.database.ref('leaderboard/' + userKey).transaction((current) => {
                    // Only update if new score is higher than current
                    if (current === null || newScore > current) {
                        return newScore;
                    }
                    return current; // Keep existing higher score
                });
            }

            return true; // Indicates new high score
        }
        return false;
    }

    // Sanitize Firebase key (remove invalid characters)
    sanitizeKey(key) {
        return key.replace(/[.#$\/\[\]]/g, '_');
    }

    // Get leaderboard entries sorted by score
    getLeaderboard() {
        const entries = Object.entries(this.scores).map(([name, score]) => ({
            name,
            score,
            isCurrent: name === this.currentUser
        }));

        // Sort by score descending
        entries.sort((a, b) => b.score - a.score);

        return entries;
    }

    // Render leaderboard HTML
    renderLeaderboard() {
        const leaderboard = this.getLeaderboard();

        return leaderboard.map((entry, index) => {
            const currentClass = entry.isCurrent ? 'current-user' : '';

            return `
                <div class="leaderboard-entry">
                    <span class="leaderboard-name ${currentClass}">
                        ${entry.name}
                    </span>
                    <span class="leaderboard-score">${entry.score} 💕</span>
                </div>
            `;
        }).join('');
    }
}

export const leaderboard = new LeaderboardManager();
