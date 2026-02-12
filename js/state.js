// State management and localStorage

import { BUTTON_GROWTH, MESSAGES } from './config.js';

class ValentineState {
    constructor() {
        this.yesPadding = BUTTON_GROWTH.initialPadding;
        this.yesFontSize = BUTTON_GROWTH.initialFontSize;
        this.messageIndex = 0;
        this.loveCount = 0;
        this.currentImageIndex = 0;
    }

    // Load love count from localStorage
    loadLoveCount() {
        const savedCount = localStorage.getItem('loveCount');
        this.loveCount = savedCount ? parseInt(savedCount) : 0;
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

    // Grow the Yes button
    growButton() {
        this.yesPadding += BUTTON_GROWTH.paddingIncrement;
        this.yesFontSize += BUTTON_GROWTH.fontSizeIncrement;
        return {
            padding: this.yesPadding,
            fontSize: this.yesFontSize
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
}

export const state = new ValentineState();
