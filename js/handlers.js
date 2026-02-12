// Event handlers and initialization

import { IMAGES, MESSAGES, IMAGE_CYCLE_INTERVAL } from './config.js';
import { state } from './state.js';
import { createFloatingOtter, updateLoveDisplay, swapImage } from './animations.js';

// Global interval for image cycling
let imageCycleInterval = null;

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
    // Stop image cycling
    stopImageCycling();

    // Increment love meter
    const newCount = state.incrementLove();
    updateLoveDisplay(newCount);

    // Create floating otter animation
    const yesButton = document.getElementById('yesButton');
    createFloatingOtter(yesButton);

    // Change the image
    swapImage('valentineImage', IMAGES.success, IMAGES.successFallback);

    // Update message
    document.querySelector('.message').textContent = MESSAGES.success;

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

    // Start cycling through images
    startImageCycling();

    // Attach event handlers
    document.getElementById('yesButton').addEventListener('click', handleYes);
    document.querySelector('.btn-no').addEventListener('click', handleNo);
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', init);
