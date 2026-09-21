// --- 1. GRAB YOUR ELEMENTS ---
const track = document.querySelector('.carousel-track');
const books = Array.from(track.children); // Get the 6 books
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const viewport = document.querySelector('.carousel-viewport');
const carouselContainer = document.querySelector('.banner-carousel'); // Added container for hover detection

// --- 2. SETUP VARIABLES ---
// Start with the 2nd book (index 1) as the center
let activeIndex = 1; 

// Variables for Auto-Scrolling
let autoPlayTimer = null;         // Holds the ID of the current timer
const autoPlayDelay = 6000;      // 6,000 milliseconds = 6 seconds

// --- 3. THE CENTERING LOGIC (Function to update the visual state) ---
function updateCarousel() {
    // 1. Remove "active" class from all books
    books.forEach(book => book.classList.remove('active'));

    // 2. Add "active" class to the current center book
    books[activeIndex].classList.add('active');

    // 3. Get the actual gap from the CSS (so it always matches)
    const gap = parseFloat(getComputedStyle(track).gap) || 15;
    const bookWidth = books[0].offsetWidth;
    const viewportWidth = viewport.offsetWidth;

    // Find the center point of the active book
    const currentBookCenter = (activeIndex * (bookWidth + gap)) + (bookWidth / 2);
    
    // Find the center of the visible viewport
    const targetCenter = viewportWidth / 2;

    // Calculate how much we need to move the track to align those two centers
    const translateX = targetCenter - currentBookCenter;

    // Apply the movement
    track.style.transform = `translateX(${translateX}px)`;
}

// --- 4. SLIDING FUNCTIONS (So we don't repeat code in the arrows and auto-play) ---
function goToNextSlide() {
    // If at the last book, loop back to the first book
    if (activeIndex < books.length - 1) {
        activeIndex++;
    } else {
        activeIndex = 0; // Loops back to start
    }
    updateCarousel();
}

function goToPrevSlide() {
    // If at the first book, loop back to the last book
    if (activeIndex > 0) {
        activeIndex--;
    } else {
        activeIndex = books.length - 1; // Loops back to end
    }
    updateCarousel();
}

// --- 5. AUTO-PLAY CONTROLS (The Core of your request) ---
function startAutoPlay() {
    // Clear any existing timer so we don't get multiple running at once
    stopAutoPlay();
    // Start a new timer that calls goToNextSlide every 10 seconds
    autoPlayTimer = setInterval(goToNextSlide, autoPlayDelay);
}

function stopAutoPlay() {
    // Clears the timer so it stops running
    clearInterval(autoPlayTimer);
}

// --- 6. EVENT LISTENERS (Handling User Interaction) ---

// Next button click
nextBtn.addEventListener('click', () => {
    stopAutoPlay(); // 1. Stop the timer so it doesn't fight with the click
    goToNextSlide(); // 2. Move the slide manually
    startAutoPlay(); // 3. Restart the 10-second timer
});

// Previous button click
prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    goToPrevSlide();
    startAutoPlay();
});

// Pause auto-scrolling when the mouse hovers over the carousel
carouselContainer.addEventListener('mouseenter', stopAutoPlay);

// Resume auto-scrolling when the mouse leaves the carousel
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// --- 7. INITIALIZE EVERYTHING ---
// Run on page load
updateCarousel();
startAutoPlay(); // Starts the automatic scrolling

// Optional: Recalculate if window resizes
window.addEventListener('resize', updateCarousel);