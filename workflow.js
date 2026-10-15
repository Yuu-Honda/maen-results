(() => {
  'use strict';
  const story = document.querySelector('[data-wf-story]');
  if (!story) return;
  const track = story.querySelector('.wf-track');
  const board = story.querySelector('.wf-board');
  const panes = Array.from(story.querySelectorAll('.wf-pane'));
  const buttons = Array.from(story.querySelectorAll('[data-wf-jump]'));
  const progressBar = story.querySelector('.wf-progress i');
  const requested = Array.from(story.querySelectorAll('[data-wf-ratio]'));
  const scan = story.querySelector('.wf-scan i');
  const cards = Array.from(story.querySelectorAll('.wf-rank-card'));
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const phase = (value, from, to) => clamp((value - from) / (to - from));
  const stops = [.22, .48, .74, .98];
  let pending = null;
  let printing = false;
  let pinned = false;
  let pinTop = 90;
  let distance = 1;
  let current = -1;
  const active = () => !printing && !motion?.matches;

  const select = index => {
    if (current === index) return;
    current = index;
    story.dataset.wfStep = String(index + 1);
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    panes.forEach((pane, i) => {
      pane.dataset.wfVisible = String(i === index);
      if (pinned) pane.setAttribute('aria-hidden', String(i !== index));
      else pane.removeAttribute('aria-hidden');
    });
  };
  const illustrate = amounts => {
    requested.forEach(node => {
      const ratio = Number(node.dataset.wfRatio);
      node.style.transform = `scaleX(${ratio + (1 - ratio) * amounts[0]})`;
    });
    scan.style.transform = `scaleX(${amounts[1]})`;
    const gap = cards[1].offsetTop - cards[0].offsetTop;
    cards.forEach((card, i) => {
      const offset = i === 0 ? gap : i === 1 ? -gap : 0;
      card.style.transform = `translateY(${offset * (1 - amounts[2])}px)`;
    });
  };
  const reset = () => {
    story.classList.remove('wf-scroll');
    board.classList.remove('wf-flow');
    track.style.height = '';
    track.dataset.wfPinned = 'false';
    panes.forEach(pane => pane.removeAttribute('aria-hidden'));
    illustrate([1, 1, 1, 1]);
    current = -1;
    story.dataset.wfStep = 'static';
  };
  const start = () => track.getBoundingClientRect().top + window.scrollY - pinTop;
  const update = () => {
    pending = null;
    if (!active()) return;
    if (pinned) {
      const p = clamp((window.scrollY - start()) / distance);
      select(Math.min(3, Math.floor(p * 4)));
      illustrate([phase(p, .02, .20), phase(p, .27, .47), phase(p, .51, .72), phase(p, .77, .98)]);
      progressBar.style.transform = `scaleX(${p})`;
      story.dataset.wfProgress = p.toFixed(6);
    } else {
      // A panel taller than the window stays in normal flow. Every stage is
      // readable and its drawing follows its own document position.
      const positions = panes.map(pane => pane.getBoundingClientRect().top);
      const amounts = positions.map(top => clamp((window.innerHeight * .80 - top) / Math.max(1, window.innerHeight * .80 - pinTop)));
      const index = positions.reduce((chosen, top, i) => top <= Math.max(pinTop + 24, window.innerHeight * .35) ? i : chosen, 0);
      select(index);
      illustrate(amounts);
      const p = amounts.reduce((sum, amount) => sum + amount, 0) / panes.length;
      progressBar.style.transform = `scaleX(${p})`;
      story.dataset.wfProgress = p.toFixed(6);
    }
  };
  const schedule = () => {
    if (pending === null) pending = window.requestAnimationFrame(update);
  };
  const measure = () => {
    if (!active()) { reset(); return; }
    story.classList.add('wf-scroll');
    board.classList.remove('wf-flow');
    track.style.height = '';
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 60;
    pinTop = Math.max(12, Math.min(120, headerHeight + 10));
    track.style.setProperty('--wf-pin-top', `${pinTop}px`);
    const height = board.getBoundingClientRect().height;
    pinned = height + pinTop + 16 <= window.innerHeight;
    track.dataset.wfPinned = String(pinned);
    board.classList.toggle('wf-flow', !pinned);
    distance = Math.max(800, Math.round(window.innerHeight * 1.35));
    track.style.height = pinned ? `${height + distance}px` : '';
    current = -1;
    update();
  };
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (!active()) return;
    const top = pinned ? start() + distance * stops[index]
      : panes[index].getBoundingClientRect().top + window.scrollY - pinTop;
    window.scrollTo({top, behavior: 'instant'});
    update();
  }));
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  window.addEventListener('beforeprint', () => { printing = true; reset(); });
  window.addEventListener('afterprint', () => { printing = false; measure(); });
  motion?.addEventListener('change', measure);
  document.fonts?.ready.then(measure);
  measure();
})();
