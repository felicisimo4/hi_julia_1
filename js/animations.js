// Animation utilities

// Create floating otter animation
export function createFloatingOtter(buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();

    // Create otter element
    const otter = document.createElement('div');
    otter.className = 'floating-otter';
    otter.textContent = '🦦';

    // Calculate random X position near the button (within button width +/- 50px)
    const randomOffset = (Math.random() - 0.5) * (buttonRect.width + 100);
    const xPosition = buttonRect.left + buttonRect.width / 2 + randomOffset;
    const yPosition = buttonRect.top;

    // Position the otter
    otter.style.left = xPosition + 'px';
    otter.style.top = yPosition + 'px';

    // Add to body
    document.body.appendChild(otter);

    // Remove after animation completes (3 seconds)
    setTimeout(() => {
        otter.remove();
    }, 3000);
}

// Update love meter display
export function updateLoveDisplay(count) {
    document.getElementById('loveCount').textContent = count;
}

// Swap image with fallback support
export function swapImage(imageId, newSrc, fallbackSrc) {
    const img = document.getElementById(imageId);
    img.onerror = () => {
        img.src = fallbackSrc;
        img.onerror = null; // Prevent infinite loop
    };
    img.src = newSrc;
}
