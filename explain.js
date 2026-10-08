(() => {
  'use strict';
  // Static markup already shows each figure's final state. This script only
  // rewinds a figure and plays it once it scrolls into view, and wires the
  // replay and toggle buttons. With reduced motion, figures stay static.
  const figures = Array.from(document.querySelectorAll('.ex-fig[data-ex]'));
  if (!figures.length) return;
  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => Boolean(motionQuery && motionQuery.matches);
  const timers = new Map();
  const frames = new Map();

  const cancel = figure => {
    (timers.get(figure) || []).forEach(window.clearTimeout);
    timers.set(figure, []);
    if (frames.has(figure)) window.cancelAnimationFrame(frames.get(figure));
    frames.delete(figure);
  };
  const later = (figure, delay, action) => {
    timers.get(figure).push(window.setTimeout(action, delay));
  };
  const step = (figure, value) => { figure.dataset.step = String(value); };

  const setMode = (figure, mode) => {
    figure.dataset.mode = mode;
    figure.querySelectorAll('[data-mode-set]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.modeSet === mode)));
  };

  // Rank lines are moved by script because SVG line endpoints cannot be
  // transitioned with CSS in every browser.
  const rankY = index => 26 + index * 33;
  const rankStates = new Map();
  const setRank = (figure, key, animate) => {
    if (!rankStates.has(figure)) rankStates.set(figure, JSON.parse(figure.dataset.rankStates));
    const target = rankStates.get(figure)[key];
    if (!target) return;
    figure.dataset.state = key;
    figure.querySelectorAll('[data-rank-set]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.rankSet === key)));
    const lines = Array.from(figure.querySelectorAll('.ex-rank-line'));
    const from = lines.map(line => Number(line.getAttribute('y2')));
    const to = lines.map((line, index) => rankY(target[Number(line.dataset.i ?? index)]));
    if (frames.has(figure)) window.cancelAnimationFrame(frames.get(figure));
    frames.delete(figure);
    if (!animate || reduced()) {
      lines.forEach((line, index) => line.setAttribute('y2', String(to[index])));
      return;
    }
    const start = performance.now();
    const duration = 900;
    const frame = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      lines.forEach((line, index) => line.setAttribute('y2', progress < 1
        ? (from[index] + (to[index] - from[index]) * eased).toFixed(1) : String(to[index])));
      if (progress < 1) frames.set(figure, window.requestAnimationFrame(frame));
      else frames.delete(figure);
    };
    frames.set(figure, window.requestAnimationFrame(frame));
  };

  const finalState = figure => {
    cancel(figure);
    step(figure, 'final');
    if (figure.dataset.ex === 'separation') setMode(figure, 'a');
    if (figure.dataset.ex === 'rank') setRank(figure, 'r007', false);
  };

  const players = {
    sieve(figure) {
      step(figure, 0);
      later(figure, 500, () => step(figure, 1));
      later(figure, 2300, () => step(figure, 2));
      later(figure, 4100, () => step(figure, 3));
    },
    classes(figure) {
      step(figure, 0);
      later(figure, 500, () => step(figure, 1));
    },
    separation(figure) {
      setMode(figure, 'a');
      step(figure, 0);
      later(figure, 500, () => step(figure, 1));
      later(figure, 1500, () => step(figure, 2));
      later(figure, 4300, () => setMode(figure, 'b'));
      later(figure, 6900, () => { setMode(figure, 'a'); step(figure, 3); });
    },
    skin(figure) {
      step(figure, 0);
      later(figure, 450, () => step(figure, 1));
      later(figure, 2000, () => step(figure, 2));
    },
    rank(figure) {
      step(figure, 0);
      setRank(figure, 'r100', false);
      later(figure, 900, () => setRank(figure, 'r095', true));
      later(figure, 2900, () => setRank(figure, 'r026', true));
      later(figure, 4900, () => { setRank(figure, 'r007', true); step(figure, 'final'); });
    },
    protein(figure) {
      step(figure, 0);
      later(figure, 500, () => step(figure, 1));
      later(figure, 2100, () => step(figure, 2));
    }
  };

  const play = figure => {
    cancel(figure);
    const player = players[figure.dataset.ex];
    if (!player || reduced()) {
      finalState(figure);
      return;
    }
    player(figure);
  };

  figures.forEach(figure => {
    timers.set(figure, []);
    figure.querySelector('[data-ex-replay]')?.addEventListener('click', () => play(figure));
    figure.querySelectorAll('[data-mode-set]').forEach(button => button.addEventListener('click', () => {
      cancel(figure);
      if (['0', '1'].includes(figure.dataset.step)) step(figure, 3);
      setMode(figure, button.dataset.modeSet);
    }));
    figure.querySelectorAll('[data-rank-set]').forEach(button => button.addEventListener('click', () => {
      cancel(figure);
      step(figure, 'final');
      setRank(figure, button.dataset.rankSet, true);
    }));
  });

  if (reduced() || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      play(entry.target);
    });
  }, { threshold: 0.3 });
  figures.forEach(figure => {
    // Rewind only figures that have not been seen yet; each plays once on entry.
    if (figure.dataset.ex === 'rank') setRank(figure, 'r100', false);
    if (figure.dataset.ex === 'separation') setMode(figure, 'a');
    step(figure, 0);
    observer.observe(figure);
  });
  motionQuery?.addEventListener?.('change', () => {
    if (reduced()) figures.forEach(finalState);
  });
})();
