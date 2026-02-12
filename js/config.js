// Configuration constants

export const IMAGES = {
    // Array of all default images to cycle through
    defaultImages: [
        './assets/images/custom/cycling/DSCN0188_Original.JPG',
        './assets/images/custom/cycling/DSCN0614.jpg',
        './assets/images/custom/cycling/IMG_0320.JPG',
        './assets/images/custom/cycling/IMG_1580.JPG',
        './assets/images/custom/cycling/IMG_3042.JPG',
        './assets/images/custom/cycling/IMG_4328.jpg',
        './assets/images/custom/cycling/IMG_4411.JPG',
        './assets/images/custom/cycling/IMG_4836.jpg',
        './assets/images/custom/cycling/IMG_4846.jpg',
        './assets/images/custom/cycling/IMG_5144.jpg',
        './assets/images/custom/cycling/IMG_5453.JPG',
        './assets/images/custom/cycling/IMG_5454.JPG',
        './assets/images/custom/cycling/IMG_5823.JPG',
        './assets/images/custom/cycling/IMG_5858.JPG',
        './assets/images/custom/cycling/IMG_7287.JPG',
        './assets/images/custom/cycling/IMG_7571.JPG',
        './assets/images/custom/cycling/IMG_8303.JPG',
        './assets/images/custom/cycling/IMG_8305.JPG'
    ],
    defaultFallback: 'https://via.placeholder.com/400x300/FF69B4/ffffff?text=Be+My+Valentine',
    success: './assets/images/custom/success/valentine-success.jpg',
    successFallback: 'https://via.placeholder.com/400x300/FF1493/ffffff?text=Thank+You!+%E2%9D%A4%EF%B8%8F'
};

export const IMAGE_CYCLE_INTERVAL = 3000; // Cycle through images every 3 seconds

export const MESSAGES = {
    initial: "Will you be my valentine this year?",
    success: "Yay! I knew you would say yes! ❤️",
    pleading: [
        "Are you sure you don't want to be my valentine? Please be my valentine.",
        "But... but... I really want you to say yes! 🥺",
        "Please reconsider! It would make me so happy! 💕",
        "Come on, just click yes! You know you want to! 😊",
        "I'll be so sad if you say no... Pretty please? 🙏",
        "The Yes button is getting bigger for a reason! 💝"
    ]
};

export const BUTTON_GROWTH = {
    initialPadding: 12,
    initialFontSize: 16,
    paddingIncrement: 5,
    fontSizeIncrement: 2
};
