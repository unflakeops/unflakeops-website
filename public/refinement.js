// Content stays visible when scripting or animation is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const entranceObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-arriving');
      entranceObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.evidence li, .pilot-detail, .working-image, .steps article').forEach(element => {
    element.classList.add('editorial-reveal');
    entranceObserver.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) entranceObserver.disconnect();
  });
}
