// Firebase Authentication Module

import { firebaseConfig, FIREBASE_ENABLED } from './firebase-config.js';
import { USER_IDENTITIES } from './config.js';

// Email mapping for each identity
const IDENTITY_EMAILS = {
    [USER_IDENTITIES.JULIA]: 'julia@valentine.local',
    [USER_IDENTITIES.MANNY]: 'manny@valentine.local',
    [USER_IDENTITIES.OTHER]: null  // Anonymous auth
};

class FirebaseAuth {
    constructor() {
        this.auth = null;
        this.currentUser = null;
        this.authInitialized = false;
        this.initAuth();
    }

    // Initialize Firebase Auth
    initAuth() {
        if (!FIREBASE_ENABLED) {
            console.log('Firebase Auth disabled');
            return;
        }

        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.error('Firebase SDK not loaded');
                return;
            }

            // Initialize Firebase app if not already initialized
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Get auth instance
            this.auth = firebase.auth();
            this.authInitialized = true;

            // Listen for auth state changes
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    console.log('User authenticated:', user.email || 'anonymous');
                } else {
                    console.log('User signed out');
                }
            });

            console.log('Firebase Auth initialized successfully!');
        } catch (error) {
            console.error('Firebase Auth initialization failed:', error);
        }
    }

    // Sign in with identity and password
    async signInWithIdentity(identity, password) {
        if (!this.authInitialized) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            // Handle "Other" identity with anonymous auth
            if (identity === USER_IDENTITIES.OTHER) {
                const result = await this.auth.signInAnonymously();
                console.log('Anonymous sign-in successful');
                return {
                    success: true,
                    user: result.user,
                    identity: USER_IDENTITIES.OTHER
                };
            }

            // Get email for this identity
            const email = IDENTITY_EMAILS[identity];
            if (!email) {
                throw new Error('Invalid identity');
            }

            // Sign in with email and password
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Sign-in successful:', email);

            return {
                success: true,
                user: result.user,
                identity: identity
            };
        } catch (error) {
            console.error('Sign-in failed:', error);

            // Handle specific error codes
            let errorMessage = 'Authentication failed';
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'User account not found';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Try again later.';
            }

            return {
                success: false,
                error: error.code,
                message: errorMessage
            };
        }
    }

    // Create user accounts (for initial setup)
    async createUserAccount(identity, password) {
        if (!this.authInitialized) {
            throw new Error('Firebase Auth not initialized');
        }

        const email = IDENTITY_EMAILS[identity];
        if (!email) {
            throw new Error('Invalid identity');
        }

        try {
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            console.log('User account created:', email);

            // Update display name
            await result.user.updateProfile({
                displayName: identity
            });

            return {
                success: true,
                user: result.user,
                identity: identity
            };
        } catch (error) {
            console.error('Account creation failed:', error);

            let errorMessage = 'Failed to create account';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Account already exists';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }

            return {
                success: false,
                error: error.code,
                message: errorMessage
            };
        }
    }

    // Sign out
    async signOut() {
        if (!this.authInitialized) {
            return;
        }

        try {
            await this.auth.signOut();
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Wait for auth to be ready
    waitForAuth() {
        return new Promise((resolve) => {
            if (this.currentUser !== undefined) {
                resolve(this.currentUser);
            } else {
                const unsubscribe = this.auth.onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                });
            }
        });
    }
}

// Export singleton instance
export const firebaseAuth = new FirebaseAuth();

// Helper function to setup user accounts (call this once in console)
export async function setupUserAccounts() {
    console.log('Setting up user accounts...');

    // Create Julia's account
    const juliaResult = await firebaseAuth.createUserAccount(
        USER_IDENTITIES.JULIA,
        'prettyprincess'
    );
    console.log('Julia account:', juliaResult);

    // Create Manny's account
    const mannyResult = await firebaseAuth.createUserAccount(
        USER_IDENTITIES.MANNY,
        'yesdear'
    );
    console.log('Manny account:', mannyResult);

    console.log('User account setup complete!');
    console.log('You can now sign in with:');
    console.log('- Girlfriend Julia: prettyprincess');
    console.log('- Boyfriend Manny: yesdear');
    console.log('- Other: no password (anonymous)');
}
