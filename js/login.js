// Login page logic with Firebase Authentication

import { USER_IDENTITIES } from './config.js';
import { firebaseAuth } from './firebase-auth.js';

// Track selected identity before password entry
let selectedIdentity = null;

// Check if user is already authenticated
async function isAuthenticated() {
    // Check session storage first for quick UI response
    if (sessionStorage.getItem('authenticated') === 'true') {
        return true;
    }

    // Wait for Firebase auth to initialize and check
    const user = await firebaseAuth.waitForAuth();
    if (user) {
        sessionStorage.setItem('authenticated', 'true');
        return true;
    }

    return false;
}

// Mark user as authenticated for this session
function setAuthenticated() {
    sessionStorage.setItem('authenticated', 'true');
}

// Show login overlay
export function showLoginOverlay() {
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.remove('hidden');
}

// Hide login overlay
function hideLoginOverlay() {
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.add('hidden');
}

// Show password input container
function showPasswordContainer(identity) {
    const loginOptions = document.getElementById('loginOptions');
    const passwordContainer = document.getElementById('loginPasswordContainer');
    const passwordPrompt = document.getElementById('loginPasswordPrompt');
    const passwordInput = document.getElementById('loginPasswordInput');
    const errorElement = document.getElementById('loginError');

    // Hide identity buttons
    loginOptions.style.display = 'none';

    // Update prompt based on identity
    if (identity === USER_IDENTITIES.JULIA) {
        passwordPrompt.textContent = 'Enter password for Girlfriend Julia:';
    } else if (identity === USER_IDENTITIES.MANNY) {
        passwordPrompt.textContent = 'Enter password for Boyfriend Manny:';
    }

    // Show password container
    passwordContainer.style.display = 'block';

    // Clear previous input and errors
    passwordInput.value = '';
    errorElement.textContent = '';

    // Focus password input
    passwordInput.focus();
}

// Hide password container and return to identity selection
function hidePasswordContainer() {
    const loginOptions = document.getElementById('loginOptions');
    const passwordContainer = document.getElementById('loginPasswordContainer');
    const errorElement = document.getElementById('loginError');

    // Show identity buttons
    loginOptions.style.display = 'flex';

    // Hide password container
    passwordContainer.style.display = 'none';

    // Clear errors
    errorElement.textContent = '';

    // Reset selected identity
    selectedIdentity = null;
}

// Show loading state
function setLoadingState(isLoading) {
    const submitButton = document.getElementById('loginSubmitBtn');
    const passwordInput = document.getElementById('loginPasswordInput');

    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = 'Authenticating...';
        passwordInput.disabled = true;
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'Enter →';
        passwordInput.disabled = false;
    }
}

// Validate password using Firebase Auth
async function validatePassword(identity, password) {
    const errorElement = document.getElementById('loginError');

    // Show loading state
    setLoadingState(true);

    try {
        // Sign in with Firebase
        const result = await firebaseAuth.signInWithIdentity(identity, password);

        if (result.success) {
            // Correct password - complete login
            completeLogin(identity);
            return true;
        } else {
            // Authentication failed
            errorElement.textContent = `❌ ${result.message}`;
            setLoadingState(false);
            return false;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        errorElement.textContent = '❌ Authentication failed. Please try again.';
        setLoadingState(false);
        return false;
    }
}

// Complete login: store identity and hide overlay
function completeLogin(identity) {
    // Store user identity in localStorage (for leaderboard system)
    localStorage.setItem('userIdentity', identity);

    // Mark as authenticated this session
    setAuthenticated();

    // Hide login overlay
    hideLoginOverlay();

    // Reset loading state
    setLoadingState(false);

    console.log('Login successful:', identity);

    // Dispatch event to notify other modules
    window.dispatchEvent(new CustomEvent('userAuthenticated', {
        detail: { identity: identity }
    }));
}

// Handle identity button click
async function handleIdentityClick(event) {
    const button = event.target.closest('[data-identity]');
    if (!button) return;

    const identity = button.dataset.identity;

    // Map button identity to USER_IDENTITIES constant
    let selectedUserIdentity;
    if (identity === 'julia') {
        selectedUserIdentity = USER_IDENTITIES.JULIA;
    } else if (identity === 'manny') {
        selectedUserIdentity = USER_IDENTITIES.MANNY;
    } else if (identity === 'other') {
        selectedUserIdentity = USER_IDENTITIES.OTHER;
    }

    // Store selected identity
    selectedIdentity = selectedUserIdentity;

    // Check if password is required
    if (selectedUserIdentity === USER_IDENTITIES.OTHER) {
        // No password required for "Other" - sign in anonymously
        const errorElement = document.getElementById('loginError');

        try {
            // Show loading feedback
            button.disabled = true;
            button.textContent = 'Signing in...';

            const result = await firebaseAuth.signInWithIdentity(selectedUserIdentity, null);

            if (result.success) {
                completeLogin(selectedUserIdentity);
            } else {
                errorElement.textContent = `❌ ${result.message}`;
                button.disabled = false;
                button.textContent = 'Other >:(';
            }
        } catch (error) {
            console.error('Anonymous sign-in error:', error);
            errorElement.textContent = '❌ Sign-in failed. Please try again.';
            button.disabled = false;
            button.textContent = 'Other >:(';
        }
    } else {
        // Show password input
        showPasswordContainer(selectedUserIdentity);
    }
}

// Handle back button click
function handleBackClick() {
    hidePasswordContainer();
}

// Handle submit button click
async function handleSubmitClick() {
    const passwordInput = document.getElementById('loginPasswordInput');
    const password = passwordInput.value;

    if (!password) {
        const errorElement = document.getElementById('loginError');
        errorElement.textContent = '⚠️ Please enter a password';
        return;
    }

    await validatePassword(selectedIdentity, password);
}

// Handle Enter key on password input
function handlePasswordKeypress(event) {
    if (event.key === 'Enter') {
        handleSubmitClick();
    }
}

// Initialize login system
export async function initLogin() {
    // Check if already authenticated
    const authenticated = await isAuthenticated();
    if (authenticated) {
        hideLoginOverlay();
        console.log('User already authenticated');
        return;
    }

    // Show login overlay on page load
    showLoginOverlay();

    // Attach event listeners
    const identityButtons = document.querySelectorAll('[data-identity]');
    identityButtons.forEach(button => {
        button.addEventListener('click', handleIdentityClick);
    });

    const backButton = document.getElementById('loginBackBtn');
    backButton.addEventListener('click', handleBackClick);

    const submitButton = document.getElementById('loginSubmitBtn');
    submitButton.addEventListener('click', handleSubmitClick);

    const passwordInput = document.getElementById('loginPasswordInput');
    passwordInput.addEventListener('keypress', handlePasswordKeypress);

    console.log('Login system initialized with Firebase Auth');
}
