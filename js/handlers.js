// Event handlers and initialization

import { IMAGES, MESSAGES, IMAGE_CYCLE_INTERVAL, LOVE_TIERS, BUTTON_GROWTH } from './config.js';
import { state } from './state.js';
import { createFloatingOtter, createFloatingOtterAndSheep, createKissingLove, updateLoveDisplay, updateHoneymoonDisplay, updateLoveGlow, swapImage } from './animations.js';
import { leaderboard } from './leaderboard.js';

// Global interval for image cycling
let imageCycleInterval = null;

// Update love tier hint based on current love count
function updateLoveTierHint(loveCount) {
    const hintElement = document.getElementById('loveTierHint');

    if (loveCount < LOVE_TIERS.tier1.threshold) {
        hintElement.textContent = LOVE_TIERS.tier1.hint;
        hintElement.style.display = 'block';
    } else if (loveCount < LOVE_TIERS.tier2.threshold) {
        hintElement.textContent = LOVE_TIERS.tier2.hint;
        hintElement.style.display = 'block';
    } else {
        hintElement.textContent = LOVE_TIERS.maxTier.message;
        hintElement.style.display = 'block';
    }
}

// Update leaderboard display
function updateLeaderboardDisplay() {
    const listElement = document.getElementById('leaderboardList');
    listElement.innerHTML = leaderboard.renderLeaderboard();
}

// Handle Share button click
export function handleShare() {
    const loveCount = state.loveCount;
    const userName = leaderboard.getCurrentUser();

    const shareData = {
        title: 'For Girlfriend Julia :3',
        text: `${userName} has ${loveCount} love points! 💕\n\nCan you beat my score?`,
        url: window.location.href
    };

    // Try Web Share API (works on mobile)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully!'))
            .catch((error) => console.log('Share failed:', error));
    } else {
        // Fallback: Copy to clipboard
        const shareText = `${shareData.text}\n\n${shareData.url}`;
        navigator.clipboard.writeText(shareText)
            .then(() => {
                alert('Link copied to clipboard! 📋\n\nShare it with Julia! 💕');
            })
            .catch(() => {
                // Final fallback: Show text
                prompt('Share this link:', shareData.url);
            });
    }
}

// Cycle through default images
function cycleImages() {
    const nextIndex = state.getNextImageIndex(IMAGES.defaultImages.length);
    const nextImage = IMAGES.defaultImages[nextIndex];
    swapImage('valentineImage', nextImage, IMAGES.defaultFallback);
}

// Start image cycling
function startImageCycling() {
    // Set initial random image
    state.currentImageIndex = Math.floor(Math.random() * IMAGES.defaultImages.length);
    const initialImage = IMAGES.defaultImages[state.currentImageIndex];
    swapImage('valentineImage', initialImage, IMAGES.defaultFallback);

    // Start cycling
    imageCycleInterval = setInterval(cycleImages, IMAGE_CYCLE_INTERVAL);
}

// Stop image cycling
function stopImageCycling() {
    if (imageCycleInterval) {
        clearInterval(imageCycleInterval);
        imageCycleInterval = null;
    }
}

// Handle Yes button click
export function handleYes() {
    // Stop image cycling on first click
    if (state.loveCount === 0) {
        stopImageCycling();
        // Change to success image on first click
        swapImage('valentineImage', IMAGES.success, IMAGES.successFallback);
    }

    // Increment both love meter and honeymoon meter
    const newCount = state.incrementLove();
    const honeymoonCount = state.getHoneymoonCount();
    updateLoveDisplay(newCount);
    updateHoneymoonDisplay(honeymoonCount);
    updateLoveGlow(newCount);

    // Update leaderboard
    const isNewHigh = leaderboard.updateScore(newCount);
    updateLeaderboardDisplay();

    // Celebrate new high score
    if (isNewHigh && newCount > 1) {
        setTimeout(() => {
            document.getElementById('submessage').textContent = '🎉 New personal best!';
        }, 1000);
    }

    // Create appropriate animation based on love tier
    const yesButton = document.getElementById('yesButton');
    if (newCount >= LOVE_TIERS.tier2.threshold) {
        // 50+ clicks: kissing animation
        createKissingLove(yesButton);
    } else if (newCount >= LOVE_TIERS.tier1.threshold) {
        // 10-49 clicks: otter and sheep
        createFloatingOtterAndSheep(yesButton);
    } else {
        // 1-9 clicks: just otter
        createFloatingOtter(yesButton);
    }

    // Update love tier hint
    updateLoveTierHint(newCount);

    // Get the appropriate success message based on click count
    const messageIndex = Math.min(newCount - 1, MESSAGES.successSequence.length - 1);
    const successMessage = MESSAGES.successSequence[messageIndex];

    // Update message with escalating excitement
    document.querySelector('.message').textContent = successMessage;

    // Clear submessage
    document.getElementById('submessage').textContent = '';
}

// Handle No button click
export function handleNo() {
    // Make the Yes button bigger
    const { padding, fontSize, atMaxSize } = state.growButton();

    const yesButton = document.getElementById('yesButton');
    yesButton.style.padding = padding + 'px ' + (padding * 2.5) + 'px';
    yesButton.style.fontSize = fontSize + 'px';

    // Add visual effects when at max size
    if (atMaxSize) {
        yesButton.classList.add('max-size');
    }

    // Show next pleading message
    const message = state.getNextMessage();
    document.getElementById('submessage').textContent = message;
}

// Handle Emulate First Yes button click
export function handleReset() {
    // Confirm before emulating
    const confirmed = confirm('Experience the first Yes again?\n\nYour leaderboard score will be kept!\nEach new Yes will still add to your total.');

    if (confirmed) {
        // Save current love count (don't reset it!)
        const currentLoveCount = state.loveCount;

        // Reset honeymoon meter to 0 (temporary emulation counter)
        state.resetHoneymoon();
        updateHoneymoonDisplay(0);

        // Reset UI state only (not the love count)
        state.yesPadding = BUTTON_GROWTH.initialPadding;
        state.yesFontSize = BUTTON_GROWTH.initialFontSize;
        state.messageIndex = 0;
        state.noClickCount = 0;
        localStorage.setItem('noClickCount', 0);

        // Reset UI elements
        const yesButton = document.getElementById('yesButton');
        yesButton.style.padding = '';
        yesButton.style.fontSize = '';
        yesButton.classList.remove('max-size');

        // Reset container glow to initial (but keep leaderboard intact)
        updateLoveGlow(0);

        // Reset messages to initial state
        document.querySelector('.message').textContent = MESSAGES.initial;
        document.getElementById('submessage').textContent = '';

        // Restart image cycling
        startImageCycling();

        // Update hint to show from beginning
        updateLoveTierHint(currentLoveCount);

        // Note: Love meter and leaderboard stay at current values!
        // Next Yes click will increment from current count
    }
}

// Initialize page
function init() {
    // Load love count from localStorage
    const loveCount = state.loadLoveCount();
    updateLoveDisplay(loveCount);
    updateHoneymoonDisplay(0); // Honeymoon always starts at 0
    updateLoveGlow(loveCount);

    // Update love tier hint based on current love count
    updateLoveTierHint(loveCount);

    // Start cycling through images if not yet clicked yes
    if (loveCount === 0) {
        startImageCycling();
    } else {
        // Show success image if already clicked
        swapImage('valentineImage', IMAGES.success, IMAGES.successFallback);
    }

    // Initialize user identity and leaderboard
    leaderboard.getCurrentUser();
    updateLeaderboardDisplay();

    // Listen for real-time leaderboard updates from Firebase
    window.addEventListener('leaderboardUpdate', () => {
        updateLeaderboardDisplay();
    });

    // Attach event handlers
    document.getElementById('yesButton').addEventListener('click', handleYes);
    document.querySelector('.btn-no').addEventListener('click', handleNo);
    document.getElementById('resetButton').addEventListener('click', handleReset);
    document.getElementById('shareButton').addEventListener('click', handleShare);

    // Restore Yes button size if previously grown (from "No" clicks)
    if (state.noClickCount > 0) {
        const yesButton = document.getElementById('yesButton');
        yesButton.style.padding = state.yesPadding + 'px ' + (state.yesPadding * 2.5) + 'px';
        yesButton.style.fontSize = state.yesFontSize + 'px';

        // Check if at max size and add visual effects
        const atMaxSize = state.yesPadding >= BUTTON_GROWTH.maxPadding &&
                         state.yesFontSize >= BUTTON_GROWTH.maxFontSize;
        if (atMaxSize) {
            yesButton.classList.add('max-size');
        }
    }
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', init);
