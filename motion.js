(() => {
  'use strict';
  // Light, fast page motion. Static HTML is always the finished state: content
  // is hidden for an entrance only after this script has run, only below the
  // first screen, and never with reduced motion or in print.
  const root = document.documentElement;
  const main = document.querySelector('main');
  if (!main) return;
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reduced = () => Boolean(motionQuery?.matches);
  const observe = 'IntersectionObserver' in window;
  root.classList.add('mo-ready');

  // 1. Reading progress: one transform per frame while scrolling.
  const bar = document.createElement('div');
  bar.className = 'mo-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.append(document.createElement('i'));
  document.body.append(bar);
  let span = 1;
  let queued = null;
  const measure = () => { span = Math.max(1, root.scrollHeight - window.innerHeight); };
  const paint = () => {
    queued = null;
    bar.firstChild.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / span))})`;
  };
  const schedule = () => { if (queued === null) queued = window.requestAnimationFrame(paint); };
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', () => { measure(); schedule(); });
  if ('ResizeObserver' in window) new ResizeObserver(() => { measure(); schedule(); }).observe(document.body);
  measure();
  paint();

  if (!observe) return;

  // 2. Pause the looping hero drawing whenever it is off screen.
  const hero = document.querySelector('.hero');
  if (hero && hero.querySelector('.signature-panel')) {
    new IntersectionObserver(entries => {
      hero.classList.toggle('mo-paused', !entries[0].isIntersecting);
    }).observe(hero);
    document.addEventListener('visibilitychange', () => hero.classList.toggle('mo-paused-tab', document.hidden));
  }

  // 3. Highlight the section being read in the top navigation.
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const targets = links.map(link => document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
  if (targets.length) {
    const visible = new Set();
    const mark = () => {
      const active = targets.find(target => visible.has(target));
      links.forEach(link => {
        if (active && link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      mark();
    }, {rootMargin: '-35% 0px -60% 0px'});
    targets.forEach(target => spy.observe(target));
  }

  if (reduced()) return;

  // 4. Entrances: short fade and rise, staggered within each batch.
  const REVEAL = [
    '.section-heading', '.research-card', '.ex-story-head', '.external-panel', '.result-panel',
    '.support-card', '.rna-grid > *', '.diagnostics-scope', '.diagnostic-card', '.diagnostic-next',
    '.roadmap-step', '.roadmap-note', '.evidence-aside', '.disclosure-list > details', '.disclaimer-intro',
    '.rp-safety', '.section > .shell > h2', '.section-intro', '.result-card', '.method-card', '.notice',
    '.confound', '.facts'
  ].join(',');
  const fold = window.innerHeight * .92;
  const pending = Array.from(main.querySelectorAll(REVEAL)).filter(node =>
    !node.closest('.ex-fig, .wf-story, .story-visual, .hero') && node.getBoundingClientRect().top > fold);
  const reveal = new IntersectionObserver(entries => {
    let order = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal.unobserve(entry.target);
      entry.target.style.setProperty('--mo-delay', `${Math.min(order++, 4) * 70}ms`);
      entry.target.classList.add('mo-in');
    });
  }, {rootMargin: '0px 0px -6% 0px'});
  pending.forEach(node => {
    node.classList.add('mo-rv');
    reveal.observe(node);
  });
  const showAll = () => pending.forEach(node => node.classList.add('mo-in'));
  window.addEventListener('beforeprint', showAll);
  motionQuery?.addEventListener?.('change', () => { if (reduced()) showAll(); });

  // 5. Key figures count up once when they come into view, then show the
  //    exact original text again.
  const COUNT = '.hero-fact strong, .rna-key strong, .external-macro strong, .diagnostic-macro strong, .metric-number, .facts strong';
  const number = /[−-]?\d[\d,]*(?:\.\d+)?/g;
  const hasNumber = /\d/;
  const counters = Array.from(main.querySelectorAll(COUNT)).map(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (hasNumber.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    return {element, nodes: nodes.map(node => ({node, text: node.nodeValue}))};
  // Fractions such as "11 / 12" stay still: a half-way "6 / 6" would misread.
  }).filter(counter => (counter.element.textContent.match(number) || []).length === 1);
  const format = (token, amount) => {
    const negative = /^[−-]/.test(token);
    const body = token.replace(/^[−-]/, '');
    const decimals = (body.split('.')[1] || '').length;
    const target = Number(body.replace(/,/g, ''));
    const [whole, fraction] = (target * amount).toFixed(decimals).split('.');
    // Keep the original look: leading zeros ("03") and thousands commas.
    const integer = body.split('.')[0].replace(/,/g, '');
    let digits = whole.padStart(integer.length > 1 && integer[0] === '0' ? integer.length : 1, '0');
    if (body.includes(',')) digits = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (negative && amount > 0 ? token[0] : '') + (fraction === undefined ? digits : `${digits}.${fraction}`);
  };
  const play = ({element, nodes}) => {
    const width = element.getBoundingClientRect().width;
    element.style.minWidth = `${width}px`;
    element.classList.add('mo-counting');
    const start = performance.now();
    const duration = 900;
    const frame = now => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      nodes.forEach(({node, text}) => {
        node.nodeValue = t === 1 ? text : text.replace(number, token => format(token, eased));
      });
      if (t < 1) window.requestAnimationFrame(frame);
      else {
        element.style.minWidth = '';
        element.classList.remove('mo-counting');
      }
    };
    window.requestAnimationFrame(frame);
  };
  const count = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      count.unobserve(entry.target);
      const counter = counters.find(item => item.element === entry.target);
      if (counter) play(counter);
    });
  }, {threshold: .6});
  counters.forEach(counter => count.observe(counter.element));
})();
