// v0.1.5: progressively enhance the native <details> with a reversible slide.
// Without JavaScript, <details> still opens/closes normally.
const guide = document.querySelector('#guide');
if (guide) {
  const summary = guide.querySelector('summary');
  const panel = guide.querySelector('.guide-content');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DURATION = 320;
  let expanded = guide.open;
  let activeAnimation = null;

  summary.addEventListener('click', event => {
    event.preventDefault();
    const next = !expanded;
    expanded = next;

    const currentHeight = guide.open ? panel.getBoundingClientRect().height : 0;
    if (activeAnimation) {
      activeAnimation.cancel();
      activeAnimation = null;
    }

    if (next) guide.open = true;
    guide.classList.toggle('guide-collapsing', !next);

    // Respect the user's device setting and browsers without Web Animations API.
    if (reduceMotion.matches || typeof panel.animate !== 'function') {
      guide.open = next;
      guide.classList.remove('guide-collapsing');
      return;
    }

    const targetHeight = next ? panel.scrollHeight : 0;
    const animation = panel.animate(
      [
        { height: currentHeight + 'px', opacity: next ? 0 : 1 },
        { height: targetHeight + 'px', opacity: next ? 1 : 0 }
      ],
      { duration: DURATION, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
    );
    activeAnimation = animation;

    animation.onfinish = () => {
      if (activeAnimation !== animation) return;
      if (!expanded) guide.open = false;
      guide.classList.remove('guide-collapsing');
      activeAnimation = null;
      animation.cancel(); // Restore intrinsic auto height and native behavior.
    };
    animation.oncancel = () => {
      if (activeAnimation === animation) activeAnimation = null;
    };
  });
}
