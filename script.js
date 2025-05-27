function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

document.addEventListener('DOMContentLoaded', () => {
  const caseElement = document.getElementById('case');
  const animationContainer = document.getElementById('animationContainer');
  const scrollingImages = document.getElementById('scrollingImages');
  const result = document.getElementById('result');
  let isAnimating = false;
  const totalImages = 98;
  const imagePath = 'project photos/';

  // Preload all images
  const preloadImages = () => {
    for (let i = 1; i <= totalImages; i++) {
      const img = new Image();
      img.src = `${imagePath}${i}.jpg`;
    }
  };

  // Create scrolling images ONCE
  function createScrollingImages() {
    scrollingImages.innerHTML = Array(totalImages * 2)
      .fill()
      .map((_, i) => {
        const idx = (i % totalImages) + 1;
        return `<img src="${imagePath}${idx}.jpg" alt="Motivation ${idx}">`;
      })
      .join('');
  }

  // Animate box on load
  setTimeout(() => {
    caseElement.classList.add('loaded');
  }, 200);

  const startUnboxing = () => {
    if (isAnimating) return;
    isAnimating = true;

    // Hide previous photo only when user clicks again
    if (result.style.display === 'block') {
      result.style.display = 'none';
      result.classList.remove('big');
    }

    // Reset box position for animation
    caseElement.classList.remove('unboxed');

    animationContainer.style.display = 'block';

    // Reset scroll position
    scrollingImages.style.transform = 'translateX(0px)';

    // Calculate total scroll steps and duration
    const targetIndex = Math.floor(Math.random() * totalImages) + 1;
    const totalScrolls = totalImages * 2 + targetIndex; // 2 passes + target
    const duration = 2200; // ms

    let startTime = null;

    function animateScroll(timestamp) {
      if (!startTime) startTime = timestamp;
      let elapsed = timestamp - startTime;
      let t = Math.min(elapsed / duration, 1);
      let eased = easeInOutCubic(t);

      let currentIndex = Math.floor(eased * (totalScrolls - 1)) + 1;
      scrollingImages.style.transform = `translateX(-${(currentIndex - 1) * 200}px)`;

      if (t < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setTimeout(() => {
          animationContainer.style.display = 'none';
          caseElement.classList.add('unboxed');
          result.innerHTML = `<img src="${imagePath}${targetIndex}.jpg" alt="Motivation ${targetIndex}">`;
          result.style.display = 'block';
          setTimeout(() => {
            result.classList.add('big');
          }, 50);
          isAnimating = false;
        }, 700);
      }
    }

    requestAnimationFrame(animateScroll);
  };

  caseElement.addEventListener('click', startUnboxing);

  preloadImages();
  createScrollingImages(); // Only ONCE at startup
});
