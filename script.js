let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e, paper);
    });

    // Touch move event
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent scrolling while dragging
      this.handleTouchMove(e, paper);
    });

    // Mouse down event
    paper.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e, paper);
    });

    // Touch start event
    paper.addEventListener('touchstart', (e) => {
      this.handleTouchStart(e, paper);
    });

    // Mouse up event
    window.addEventListener('mouseup', () => {
      this.releasePaper();
    });

    // Touch end event
    window.addEventListener('touchend', () => {
      this.releasePaper();
    });

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  handleMouseMove(e, paper) {
    if (this.holdingPaper && !this.rotating) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  handleTouchMove(e, paper) {
    if (this.holdingPaper && !this.rotating) {
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;

      if (this.prevTouchX !== 0 && this.prevTouchY !== 0) {
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }

      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;
    }
  }

  handleMouseDown(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    if (e.button === 0) { // Left mouse button
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    }
    if (e.button === 2) { // Right mouse button
      this.rotating = true;
    }
  }

  handleTouchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;
  }

  releasePaper() {
    this.holdingPaper = false;
    this.rotating = false;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});