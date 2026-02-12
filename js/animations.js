// Animation utilities

// Create floating otter animation (< 10 clicks)
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

// Create floating otter AND sheep animation (10-49 clicks)
export function createFloatingOtterAndSheep(buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();

    // Create otter element
    const otter = document.createElement('div');
    otter.className = 'floating-otter';
    otter.textContent = '🦦';

    // Create sheep element
    const sheep = document.createElement('div');
    sheep.className = 'floating-sheep';
    sheep.textContent = '🐑';

    // Calculate positions - sheep slightly to the left, otter slightly to the right
    const randomOffset = (Math.random() - 0.5) * (buttonRect.width + 100);
    const centerX = buttonRect.left + buttonRect.width / 2 + randomOffset;
    const yPosition = buttonRect.top;

    // Position otter (right side)
    otter.style.left = (centerX + 20) + 'px';
    otter.style.top = yPosition + 'px';

    // Position sheep (left side)
    sheep.style.left = (centerX - 20) + 'px';
    sheep.style.top = yPosition + 'px';

    // Add to body
    document.body.appendChild(otter);
    document.body.appendChild(sheep);

    // Remove after animation completes (3 seconds)
    setTimeout(() => {
        otter.remove();
        sheep.remove();
    }, 3000);
}

// Create kissing love animation (50+ clicks)
export function createKissingLove(buttonElement) {
    const buttonRect = buttonElement.getBoundingClientRect();

    // Create container for the kissing couple
    const container = document.createElement('div');
    container.className = 'floating-kiss';

    // Create the kissing emoji combination: 🐑💋🦦
    const kissingCouple = document.createElement('span');
    kissingCouple.textContent = '🐑💋🦦';
    kissingCouple.style.fontSize = 'inherit';

    container.appendChild(kissingCouple);

    // Calculate position
    const randomOffset = (Math.random() - 0.5) * (buttonRect.width + 100);
    const xPosition = buttonRect.left + buttonRect.width / 2 + randomOffset;
    const yPosition = buttonRect.top;

    // Position the kiss
    container.style.left = xPosition + 'px';
    container.style.top = yPosition + 'px';

    // Add to body
    document.body.appendChild(container);

    // Remove after animation completes (3 seconds)
    setTimeout(() => {
        container.remove();
    }, 3000);
}

// Update love meter display
export function updateLoveDisplay(count) {
    document.getElementById('loveCount').textContent = count;
}

// Update container glow effect based on love count
export function updateLoveGlow(count) {
    const container = document.querySelector('.container');

    // Determine glow level based on love count
    let glowLevel = 0;
    if (count >= 50) {
        glowLevel = 3; // Maximum glow at 50+ clicks
    } else if (count >= 10) {
        glowLevel = 2; // Medium glow at 10-49 clicks
    } else if (count >= 1) {
        glowLevel = 1; // Gentle glow at 1-9 clicks
    }

    // Set the data attribute to trigger CSS glow
    container.setAttribute('data-love-glow', glowLevel);
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
