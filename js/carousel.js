/* ── CAROUSEL COMPONENT ── */
/* Initialises all carousels on the page. Each carousel needs:
     - a .carousel-frame with a unique id
     - a .carousel-track inside it
     - .carousel-slide elements inside the track
     - .carousel-btn.prev and .carousel-btn.next inside the frame
     - a .carousel-dots element whose id = frame id + "Dots"
*/

(function () {
  const DOT_SIZES = [8, 6.5, 5, 3.5];

  function getDotSize(dist) {
    return DOT_SIZES[Math.min(dist, DOT_SIZES.length - 1)];
  }

  function initCarousel(frame) {
    const track   = frame.querySelector('.carousel-track');
    const prevBtn = frame.querySelector('.carousel-btn.prev');
    const nextBtn = frame.querySelector('.carousel-btn.next');
    const dotsEl  = document.getElementById(frame.id + 'Dots');
    const slides  = track.querySelectorAll('.carousel-slide');
    const total   = slides.length;
    let current   = 0;

    function updateDots() {
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        const dist = Math.abs(i - current);
        const size = getDotSize(dist);
        d.style.width  = size + 'px';
        d.style.height = size + 'px';
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
    }

    /* Build dots */
    slides.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'carousel-dot';
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });

    goTo(0);

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    /* Swipe support */
    let touchStartX = 0;
    frame.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    /* Keyboard — only when this carousel is focused */
    frame.setAttribute('tabindex', '0');
    frame.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });
  }

  /* Auto-init every .carousel-frame on the page */
  document.querySelectorAll('.carousel-frame').forEach(initCarousel);
})();
