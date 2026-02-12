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

// Update honeymoon meter display
export function updateHoneymoonDisplay(count) {
    document.getElementById('honeymoonCount').textContent = count;
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

// Update love meter color based on count
export function updateLoveMeterColor(count) {
    const loveMeter = document.querySelector('.love-meter');

    if (count >= 500) {
        loveMeter.setAttribute('data-love-level', '3');
    } else if (count >= 50) {
        loveMeter.setAttribute('data-love-level', '2');
    } else if (count >= 10) {
        loveMeter.setAttribute('data-love-level', '1');
    } else {
        loveMeter.setAttribute('data-love-level', '0');
    }
}

// Create kneeling devotion animation (2000+ clicks)
export function createKneelingAnimation() {
    const kneelingEmojis = ['🧎', '🧎‍♂️', '🧎‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️'];

    // Create 3-6 random kneeling emojis at random positions
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6 emojis

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'kneeling-emoji';
            emoji.textContent = kneelingEmojis[Math.floor(Math.random() * kneelingEmojis.length)];

            // Random position on screen
            emoji.style.left = (Math.random() * 80 + 10) + '%';
            emoji.style.top = (Math.random() * 60 + 20) + '%';

            document.body.appendChild(emoji);

            // Remove after animation completes
            setTimeout(() => {
                emoji.remove();
            }, 4000);
        }, i * 300); // Stagger the appearance
    }
}

// Create fireworks animation (5000+ clicks)
export function createFireworksAnimation() {
    const fireworkEmojis = ['🎆', '🎇', '✨', '💥', '⭐', '🌟'];

    // Create 8-15 random fireworks at random positions
    const count = Math.floor(Math.random() * 8) + 8; // 8 to 15 fireworks

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework-emoji';
            firework.textContent = fireworkEmojis[Math.floor(Math.random() * fireworkEmojis.length)];

            // Random position across entire screen
            firework.style.left = (Math.random() * 90 + 5) + '%';
            firework.style.top = (Math.random() * 70 + 10) + '%';

            document.body.appendChild(firework);

            // Remove after animation completes
            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, i * 100); // Quick succession
    }
}

// Create orbital snake animation (500+ clicks)
export function createOrbitalSnake() {
    // Random peak height for left snake (200px to 450px on desktop, 120px to 280px on mobile)
    const isMobile = window.innerWidth <= 430;
    const minHeight = isMobile ? 120 : 200;
    const maxHeight = isMobile ? 280 : 450;
    const leftPeakHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    // Create left-moving snake
    const snakeLeft = document.createElement('div');
    snakeLeft.className = 'orbital-snake orbital-snake-left';
    snakeLeft.textContent = '🐍';
    snakeLeft.style.setProperty('--peak-height', `${leftPeakHeight}px`);
    document.body.appendChild(snakeLeft);

    // Create right-moving snake (slightly delayed, different random height)
    setTimeout(() => {
        const rightPeakHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        const snakeRight = document.createElement('div');
        snakeRight.className = 'orbital-snake orbital-snake-right';
        snakeRight.textContent = '🐍';
        snakeRight.style.setProperty('--peak-height', `${rightPeakHeight}px`);
        document.body.appendChild(snakeRight);

        // Remove after animation completes
        setTimeout(() => {
            snakeRight.remove();
        }, 8000);
    }, 2000);

    // Remove after animation completes
    setTimeout(() => {
        snakeLeft.remove();
    }, 8000);
}
