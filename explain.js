(() => {
  'use strict';
  // The document scroll position is the only clock. Static HTML is the final
  // state; no wheel/touch input is intercepted and no timed animation runs.
  const figures = Array.from(document.querySelectorAll('.ex-fig[data-ex]'));
  if (!figures.length) return;
  const english = document.documentElement.lang.startsWith('en');
  const words = english ? {
    help: 'Scroll down to advance · up to rewind · stop to read',
    note: 'Scrolling controls the explanation, not experimental time.',
    start: 'Back to start', end: 'Go to final state',
    moving: 'Moving between completed examples (schematic).',
    examples: 'Go to a completed example'
  } : {
    help: '下へ進む · 上へ戻る · 止めて読む',
    note: 'スクロールは説明の順序を操作します。実験の時間経過ではありません。',
    start: '最初へ戻る', end: '最後へ進む',
    moving: '完成した例の間を移動中（模式図）。',
    examples: '完成した例へ移動'
  };
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reduced = () => Boolean(motionQuery?.matches);
  const clamp = value => Math.max(0, Math.min(1, value));
  const phase = (p, from, to) => clamp((p - from) / (to - from));
  const mix = (a, b, p) => a + (b - a) * p;
  const colors = { base: [26,154,116], hit: [217,98,43], drop: [214,221,216], skin: [42,120,214], other: [201,210,204] };
  const color = (a, b, p) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], p))).join(',')})`;
  let printing = false;
  let frame = null;
  let layoutFrame = null;
  let lastScroll = window.scrollY;
  const models = figures.map(figure => ({
    figure, kind: figure.dataset.ex, visual: figure.querySelector('.ex-visual'),
    controls: figure.querySelector('.ex-controls'), start: 0, distance: 1, progress: null,
    dots: Array.from(figure.querySelectorAll('.ex-dot')),
    cells: Array.from(figure.querySelectorAll('.ex-cell.hit')),
    skin: Array.from(figure.querySelectorAll('.ex-line')),
    sep: Array.from(figure.querySelectorAll('.ex-sep-dot')).map(node => ({
      node, x: parseFloat(node.style.getPropertyValue('--ox0')),
      y: parseFloat(node.style.getPropertyValue('--oy0')),
      b: parseFloat(node.style.getPropertyValue('--oxb'))
    })),
    candidates: Array.from(figure.querySelectorAll('.ex-cand')).map(node => ({
      node, y: parseFloat(node.style.getPropertyValue('--dy0'))
    })),
    rank: figure.dataset.rankStates ? JSON.parse(figure.dataset.rankStates) : null,
    lines: Array.from(figure.querySelectorAll('.ex-rank-line'))
  }));

  const setMode = (model, mode) => {
    model.figure.dataset.mode = mode;
    model.figure.querySelectorAll('[data-mode-set]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.modeSet === mode)));
  };
  const rankFrame = (model, from, to = from, amount = 0) => {
    const key = from === to ? from : 'moving';
    model.figure.dataset.state = key;
    model.figure.querySelectorAll('[data-rank-set]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.rankSet === key)));
    model.lines.forEach((line, i) => {
      const index = Number(line.dataset.i ?? i);
      const y = mix(model.rank[from][index], model.rank[to][index], amount) * 33 + 26;
      line.setAttribute('y2', String(y));
    });
  };

  const render = (model, p) => {
    const f = model.figure;
    model.progress = p;
    f.dataset.exProgress = p.toFixed(6);
    f.dataset.step = 'final';
    if (model.fill) model.fill.style.transform = `scaleX(${p})`;
    if (model.percent) model.percent.textContent = `${Math.round(p * 100)}%`;
    if (model.kind === 'sieve') {
      const stages = [phase(p, .08, .28), phase(p, .36, .56), phase(p, .64, .90)];
      f.dataset.step = String(p < .28 ? 0 : p < .56 ? 1 : p < .90 ? 2 : 3);
      model.dots.forEach(dot => {
        const drop = !dot.classList.contains('s1') ? stages[0]
          : !dot.classList.contains('s2') ? stages[1]
          : !dot.classList.contains('s3') ? stages[2] : 0;
        dot.style.fill = color(colors.base, dot.classList.contains('s3') ? colors.hit : colors.drop,
          dot.classList.contains('s3') ? stages[2] : drop);
        dot.style.opacity = String(1 - drop * .2);
        dot.style.transform = `translateY(${drop * 5}px)`;
      });
      f.querySelectorAll('.ex-ring').forEach(node => { node.style.opacity = String(phase(p, .90, 1) * .85); });
    } else if (model.kind === 'classes') {
      const amount = phase(p, .10, .85);
      model.cells.forEach(node => {
        node.style.fill = color(colors.base, colors.hit, amount);
        node.style.transform = `scale(${1 - .45 * amount})`;
      });
    } else if (model.kind === 'skin') {
      const skin = phase(p, .08, .40), hit = phase(p, .50, .90);
      model.skin.forEach(node => {
        const base = node.classList.contains('skin') ? colors.skin : colors.other;
        const highlighted = node.classList.contains('skin')
          ? colors.other.map((v, i) => mix(v, base[i], skin)) : base;
        node.style.fill = color(highlighted, colors.hit, node.classList.contains('hit') ? hit : 0);
        node.style.strokeWidth = String(node.classList.contains('hit') ? hit * 1.5 : 0);
      });
      f.querySelector('.ex-skin-zone').style.opacity = String(skin * .6);
    } else if (model.kind === 'separation') {
      const highlight = phase(p, .02, .12), move = phase(p, .14, .32);
      const shuffle = phase(p, .44, .62) * (1 - phase(p, .74, .92));
      const ready = (p >= .32 && p <= .44) || (p >= .62 && p <= .74) || p >= .92;
      const mode = p >= .62 && p <= .74 ? 'b' : 'a';
      setMode(model, ready ? mode : 'moving');
      f.dataset.measurement = ready ? 'ready' : 'moving';
      model.sep.forEach(({node, x, y, b}) => {
        node.style.transform = `translate(${mix(x, b * shuffle, move)}px,${y * (1 - move)}px)`;
        if (node.classList.contains('hit')) node.style.fill = color(colors.base, colors.hit, highlight);
      });
      f.querySelectorAll('.ex-sep-ghost.hit').forEach(node => {
        node.style.fill = color(colors.base, colors.hit, highlight);
        node.style.opacity = String(.28 + highlight * .17);
      });
      // Only completed toy arrangements have a displayed separation value.
      f.querySelector('.ex-meter-fill').style.transform = `scaleX(${mode === 'b' ? 45/95 : 91/95})`;
    } else if (model.kind === 'rank') {
      if (p <= .12) rankFrame(model, 'r100');
      else if (p < .30) rankFrame(model, 'r100', 'r095', phase(p, .12, .30));
      else if (p <= .42) rankFrame(model, 'r095');
      else if (p < .60) rankFrame(model, 'r095', 'r026', phase(p, .42, .60));
      else if (p <= .72) rankFrame(model, 'r026');
      else if (p < .90) rankFrame(model, 'r026', 'r007', phase(p, .72, .90));
      else rankFrame(model, 'r007');
    } else if (model.kind === 'protein') {
      const score = phase(p, .08, .40), order = phase(p, .48, .90);
      model.candidates.forEach(({node, y}) => { node.style.transform = `translateY(${y * (1 - order)}px)`; });
      f.querySelectorAll('.ex-score').forEach(node => { node.style.transform = `scaleX(${score})`; });
      f.querySelector('.ex-svg-badge').style.opacity = String(phase(p, .90, 1));
      f.querySelector('.ex-cand.same .ex-cand-bg').style.stroke = order === 1 ? 'var(--ex-hit)' : 'transparent';
    }
  };

  const staticState = model => {
    render(model, 1);
    model.figure.classList.remove('ex-scroll-enabled');
    model.figure.querySelectorAll('[style]').forEach(node => {
      // Keep original SVG custom properties and geometry; clear runtime styles.
      ['fill','opacity','transform','stroke','stroke-width'].forEach(key => node.style.removeProperty(key));
    });
    model.figure.dataset.step = 'final';
    if (model.kind === 'rank') rankFrame(model, 'r007');
    if (model.kind === 'separation') {
      setMode(model, 'a');
      model.figure.dataset.measurement = 'ready';
    }
  };

  const bounds = model => {
    // Existing aggregate tables can finish loading after window.load. Read
    // the current document position so those layout shifts cannot stale a range.
    const top = Number(model.track.dataset.pinTop);
    model.start = model.track.getBoundingClientRect().top + window.scrollY - top;
    model.track.dataset.start = String(model.start);
    model.track.dataset.end = String(model.start + model.distance);
  };
  const measure = () => {
    const viewport = window.innerHeight;
    const header = document.querySelector('header');
    const top = Math.max(12, Math.min(110, (header?.getBoundingClientRect().height || 60) + 12));
    models.forEach(model => {
      if (!model.track) return;
      const active = !reduced() && !printing;
      model.figure.classList.toggle('ex-scroll-enabled', active);
      const height = model.visual.getBoundingClientRect().height;
      const pinned = active && height + top + 16 <= viewport;
      // Short landscape windows retain ordinary document flow instead of
      // pinning a diagram taller than the visible screen.
      model.distance = pinned ? Math.max(480, Math.round(viewport * .90)) : Math.max(1, viewport * .80 - top);
      model.track.dataset.pinned = String(pinned);
      model.track.style.setProperty('--ex-pin-top', `${top}px`);
      model.track.style.height = active && pinned ? `${height + model.distance}px` : '';
      // In ordinary flow, finish as the diagram reaches the header, then
      // keep its final frame while the reader scrolls through its lower part.
      model.track.dataset.pinTop = String(pinned ? top : viewport * .80);
      bounds(model);
      model.progress = null;
    });
  };
  const update = () => {
    frame = null;
    const scroll = window.scrollY;
    lastScroll = scroll;
    if (reduced() || printing) return;
    models.forEach(model => {
      bounds(model);
      const p = clamp((scroll - model.start) / model.distance);
      if (p !== model.progress) render(model, p);
    });
  };
  const schedule = () => {
    if (frame === null) frame = window.requestAnimationFrame(update);
  };
  const layout = () => { measure(); schedule(); };
  const jump = (model, p) => {
    if (reduced() || printing) {
      if (model.kind === 'rank') rankFrame(model, { .06:'r100', .36:'r095', .66:'r026', .96:'r007' }[p] || 'r007');
      else if (model.kind === 'separation') setMode(model, p === .68 ? 'b' : 'a');
      return;
    }
    bounds(model);
    window.scrollTo({ top: model.start + model.distance * p, behavior: 'instant' });
    update();
  };

  models.forEach(model => {
    const {figure, visual, controls} = model;
    const track = document.createElement('div');
    track.className = 'ex-scroll-track';
    visual.before(track);
    track.append(visual);
    model.track = track;
    // The real aggregate control is a separate, static comparison below the
    // pinned schematic. It is never interpolated as if it were an experiment.
    const bars = visual.querySelector('.ex-bars');
    if (bars) {
      bars.classList.add('ex-scroll-after');
      figure.append(bars);
    }
    visual.append(controls);
    const stop = controls.querySelector('[data-ex-stop]');
    const replay = controls.querySelector('[data-ex-replay]');
    stop.textContent = words.end;
    replay.textContent = words.start;
    controls.append(replay, stop);
    replay.addEventListener('click', () => jump(model, 0));
    stop.addEventListener('click', () => jump(model, 1));
    controls.querySelectorAll('.ex-toggle').forEach(node => node.setAttribute('aria-label', words.examples));
    controls.querySelectorAll('[data-mode-set]').forEach(button => button.addEventListener('click', () => jump(model, button.dataset.modeSet === 'b' ? .68 : .38)));
    controls.querySelectorAll('[data-rank-set]').forEach(button => button.addEventListener('click', () => jump(model, {r100:.06,r095:.36,r026:.66,r007:.96}[button.dataset.rankSet])));
    if (model.kind === 'rank') {
      const note = document.createElement('p');
      note.dataset.rankNote = 'moving';
      note.textContent = words.moving;
      visual.querySelector('.ex-rank-notes').append(note);
    }
    const help = document.createElement('div');
    help.className = 'ex-scroll-help';
    const label = document.createElement('p');
    label.textContent = words.help;
    const meter = document.createElement('div');
    meter.className = 'ex-scroll-progress';
    meter.setAttribute('aria-hidden', 'true');
    model.fill = document.createElement('i');
    meter.append(model.fill);
    model.percent = document.createElement('span');
    model.percent.setAttribute('aria-hidden', 'true');
    const note = document.createElement('p');
    note.className = 'ex-scroll-note';
    note.textContent = words.note;
    help.append(label, model.percent, meter, note);
    visual.append(help);
  });

  window.addEventListener('scroll', () => {
    // A coalesced render follows scroll input, then stops. There is no frame
    // loop, timeout, CSS transition or easing after the document stops moving.
    if (window.scrollY !== lastScroll) schedule();
  }, {passive:true});
  window.addEventListener('resize', layout);
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (layoutFrame !== null) return;
      layoutFrame = window.requestAnimationFrame(() => {
        layoutFrame = null;
        layout();
      });
    }).observe(document.body);
  }
  window.addEventListener('load', layout, {once:true});
  document.fonts?.ready.then(layout);
  motionQuery?.addEventListener?.('change', () => {
    if (reduced()) models.forEach(staticState);
    layout();
  });
  window.addEventListener('beforeprint', () => {
    printing = true;
    models.forEach(staticState);
    measure();
  });
  window.addEventListener('afterprint', () => { printing = false; layout(); });
  if (reduced()) models.forEach(staticState);
  layout();
})();
