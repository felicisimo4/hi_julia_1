// Event handlers and initialization

import { IMAGES, MESSAGES, IMAGE_CYCLE_INTERVAL, LOVE_TIERS } from './config.js';
import { state } from './state.js';
import { createFloatingOtter, createFloatingOtterAndSheep, createKissingLove, updateLoveDisplay, updateLoveGlow, swapImage } from './animations.js';

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

    // Increment love meter
    const newCount = state.incrementLove();
    updateLoveDisplay(newCount);
    updateLoveGlow(newCount);

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
    const { padding, fontSize } = state.growButton();

    const yesButton = document.getElementById('yesButton');
    yesButton.style.padding = padding + 'px ' + (padding * 2.5) + 'px';
    yesButton.style.fontSize = fontSize + 'px';

    // Show next pleading message
    const message = state.getNextMessage();
    document.getElementById('submessage').textContent = message;
}

// Initialize page
function init() {
    // Load love count from localStorage
    const loveCount = state.loadLoveCount();
    updateLoveDisplay(loveCount);
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

    // Attach event handlers
    document.getElementById('yesButton').addEventListener('click', handleYes);
    document.querySelector('.btn-no').addEventListener('click', handleNo);
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', init);
