let highestZ = 1; // Variable to track the highest z-index for stacking papers

class Paper {
  holdingPaper = false; // Flag to check if the paper is currently being held
  touchStartX = 0; // Initial touch X position
  touchStartY = 0; // Initial touch Y position
  touchMoveX = 0; // Current touch X position during movement
  touchMoveY = 0; // Current touch Y position during movement
  touchEndX = 0; // Final touch X position when touch ends
  touchEndY = 0; // Final touch Y position when touch ends
  prevTouchX = 0; // Previous touch X position
  prevTouchY = 0; // Previous touch Y position
  velX = 0; // Velocity in X direction
  velY = 0; // Velocity in Y direction
  rotation = Math.random() * 30 - 15; // Random initial rotation between -15 and +15 degrees
  currentPaperX = 0; // Current X position of the paper
  currentPaperY = 0; // Current Y position of the paper
  rotating = false; // Flag to check if the paper is currently rotating

  // Initialize the paper element with touch event listeners
  init(paper) {
    // Handle touch movement
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent default scrolling behavior on touch devices

      if (!this.rotating) {
        // Update touch positions and velocities if not rotating
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        this.velX = this.touchMoveX - this.prevTouchX; // Calculate velocity in X direction
        this.velY = this.touchMoveY - this.prevTouchY; // Calculate velocity in Y direction
      }

      // Calculate direction and angle for rotation
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY); // Calculate the length of the direction vector
      const dirNormalizedX = dirX / dirLength; // Normalize X direction
      const dirNormalizedY = dirY / dirLength; // Normalize Y direction

      // Calculate the angle in degrees for rotation
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI; // Convert radians to degrees
      degrees = (360 + Math.round(degrees)) % 360; // Normalize degrees to [0, 360]

      // Update rotation if currently rotating
      if (this.rotating) {
        this.rotation = degrees;
      }

      // Update paper position if holding the paper
      if (this.holdingPaper) {
        if (!this.rotating) {
          // Update current position based on velocity
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        // Update previous touch positions
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        // Apply transformation to the paper element
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false }); // Set passive to false to allow preventDefault

    // Handle touch start event
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return; // If already holding, do nothing
      this.holdingPaper = true; // Set holding flag to true

      paper.style.zIndex = highestZ; // Set z-index to stack the paper above others
      highestZ += 1; // Increment z-index for the next paper

      // Store initial touch positions
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX; // Initialize previous touch positions
      this.prevTouchY = this.touchStartY;
    }, { passive: false }); // Set passive to false to allow preventDefault

    // Handle touch end event
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false; // Reset holding flag
      this.rotating = false; // Reset rotating flag
    });

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault(); // Prevent default gesture behavior
      this.rotating = true; // Set rotating flag to true
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false; // Reset rotating flag when gesture ends
    });
  }
}

// Select all elements with the class 'paper' and initialize them
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper(); // Create a new Paper instance
  p.init(paper); // Initialize the paper element with event listeners
});