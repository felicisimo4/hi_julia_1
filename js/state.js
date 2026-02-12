// State management and localStorage

import { BUTTON_GROWTH, MESSAGES } from './config.js';

class ValentineState {
    constructor() {
        this.yesPadding = BUTTON_GROWTH.initialPadding;
        this.yesFontSize = BUTTON_GROWTH.initialFontSize;
        this.messageIndex = 0;
        this.loveCount = 0;
        this.currentImageIndex = 0;
        this.noClickCount = 0; // Track "No" clicks for button size
    }

    // Load love count from localStorage
    loadLoveCount() {
        const savedCount = localStorage.getItem('loveCount');
        this.loveCount = savedCount ? parseInt(savedCount) : 0;

        // Load no click count and recalculate button size
        const savedNoClicks = localStorage.getItem('noClickCount');
        this.noClickCount = savedNoClicks ? parseInt(savedNoClicks) : 0;

        // Recalculate button size based on saved no clicks
        this.yesPadding = BUTTON_GROWTH.initialPadding + (this.noClickCount * BUTTON_GROWTH.paddingIncrement);
        this.yesFontSize = BUTTON_GROWTH.initialFontSize + (this.noClickCount * BUTTON_GROWTH.fontSizeIncrement);

        // Cap at max values
        if (this.yesPadding > BUTTON_GROWTH.maxPadding) this.yesPadding = BUTTON_GROWTH.maxPadding;
        if (this.yesFontSize > BUTTON_GROWTH.maxFontSize) this.yesFontSize = BUTTON_GROWTH.maxFontSize;

        return this.loveCount;
    }

    // Save love count to localStorage
    saveLoveCount() {
        localStorage.setItem('loveCount', this.loveCount);
    }

    // Increment love count
    incrementLove() {
        this.loveCount++;
        this.saveLoveCount();
        return this.loveCount;
    }

    // Grow the Yes button (caps at max size)
    growButton() {
        // Increment no click count
        this.noClickCount++;
        localStorage.setItem('noClickCount', this.noClickCount);

        // Only grow if below max size
        if (this.yesPadding < BUTTON_GROWTH.maxPadding) {
            this.yesPadding += BUTTON_GROWTH.paddingIncrement;
        }
        if (this.yesFontSize < BUTTON_GROWTH.maxFontSize) {
            this.yesFontSize += BUTTON_GROWTH.fontSizeIncrement;
        }

        // Check if at max size
        const atMaxSize = this.yesPadding >= BUTTON_GROWTH.maxPadding &&
                         this.yesFontSize >= BUTTON_GROWTH.maxFontSize;

        return {
            padding: this.yesPadding,
            fontSize: this.yesFontSize,
            atMaxSize: atMaxSize
        };
    }

    // Get next pleading message
    getNextMessage() {
        const message = MESSAGES.pleading[this.messageIndex];
        this.messageIndex = (this.messageIndex + 1) % MESSAGES.pleading.length;
        return message;
    }

    // Get next image index
    getNextImageIndex(totalImages) {
        this.currentImageIndex = (this.currentImageIndex + 1) % totalImages;
        return this.currentImageIndex;
    }

    // Get current image index
    getCurrentImageIndex() {
        return this.currentImageIndex;
    }

    // Reset all state to initial values
    reset() {
        this.yesPadding = BUTTON_GROWTH.initialPadding;
        this.yesFontSize = BUTTON_GROWTH.initialFontSize;
        this.messageIndex = 0;
        this.loveCount = 0;
        this.currentImageIndex = 0;
        this.noClickCount = 0;
        localStorage.removeItem('loveCount');
        localStorage.removeItem('noClickCount');
    }
}

export const state = new ValentineState();
