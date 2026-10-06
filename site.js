(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const isJapanese = document.documentElement.lang === 'ja';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const closeMenu = () => {
    if (!menu || !navigation) return;
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  if (menu && navigation) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
  }

  document.querySelectorAll('#runs tr').forEach(row => {
    const cells = Array.from(row.children).slice(1);
    const minimum = Math.min(...cells.map(cell => Number(cell.textContent)));
    cells.forEach(cell => cell.classList.toggle('best', Number(cell.textContent) === minimum));
  });

  const controls = document.querySelector('.viewer-controls');
  const status = document.querySelector('#protein-status');
  const directionInput = document.querySelector('#protein-direction');
  const metricButtons = Array.from(document.querySelectorAll('[data-metric]'));
  if (!controls || !status || !directionInput || !metricButtons.length) return;

  const methods = ['observed_cosine', 'mask_jaccard', 'value_permuted_cosine'];
  const directions = ['all', 'R1_to_R2', 'R2_to_R1'];
  const metrics = ['top1', 'top5', 'mrr'];
  let selectedMetric = 'top1';
  let data;
  const text = isJapanese ? {
    all: '両方向', R1_to_R2: 'R1 → R2', R2_to_R1: 'R2 → R1',
    top1Label: '元の投与条件が1位に', top5Label: '元の投与条件が5位以内に', mrrLabel: '元の投与条件の平均逆順位',
    top1Definition: 'Top 1は、元の投与条件が候補の1位に戻った割合です。検索対象は測定済みの条件に限られます。',
    top5Definition: 'Top 5は、元の投与条件が候補の5位以内に戻った割合です。検索対象は測定済みの条件に限られます。',
    mrrDefinition: 'MRRは、元の投与条件の順位の逆数を平均した値です。1位なら1、2位なら0.5。高いほど上位に戻っています。成功率や治療効果ではありません。',
    count: number => `${number} 問い合わせの平均`,
    hits: (hits, queries) => `${hits} / ${queries} 問い合わせ`,
    reference: value => `均等順位の参照：${value}`,
    showing: (direction, metric, result) => `${direction} / ${metric} の集計：${result}を表示しています。`,
    failure: '詳細データを読み込めないため、両方向のTop 1集計を表示しています。一次資料と集計JSONは「記録」から確認できます。'
  } : {
    all: 'Both directions', R1_to_R2: 'R1 → R2', R2_to_R1: 'R2 → R1',
    top1Label: 'Original condition ranked first', top5Label: 'Original condition in the top 5', mrrLabel: 'Mean reciprocal rank of the original condition',
    top1Definition: 'Top 1 is the share of queries that rank the original condition first. The search is limited to measured conditions.',
    top5Definition: 'Top 5 is the share of queries that rank the original condition in the first five candidates. The search is limited to measured conditions.',
    mrrDefinition: 'MRR averages the reciprocal rank of the original condition: 1 for first place, 0.5 for second. Higher values mean better ranks. It is not a success rate or treatment effect.',
    count: number => `Mean across ${number} queries`,
    hits: (hits, queries) => `${hits} / ${queries} queries`,
    reference: value => `Uniform-rank reference: ${value}`,
    showing: (direction, metric, result) => `Showing ${direction} / ${metric}: ${result}.`,
    failure: 'Detailed data could not be loaded. The combined Top 1 aggregate is shown. Primary sources and summary JSON are available under Evidence.'
  };

  const recordFor = (method, direction) => direction === 'all'
    ? data.primary[method].summary
    : data.primary[method].by_direction[direction];

  const validRecord = record => {
    if (!record || !Number.isInteger(record.queries) || record.queries < 1) return false;
    for (const metric of metrics) {
      if (!Number.isFinite(record[metric]) || record[metric] < 0 || record[metric] > 1) return false;
      const reference = record.uniform_rank_reference?.[metric];
      if (!Number.isFinite(reference) || reference < 0 || reference > 1) return false;
    }
    return ['top1_hits', 'top5_hits'].every(key => Number.isInteger(record[key]) && record[key] >= 0 && record[key] <= record.queries);
  };

  const formatted = (value, metric) => metric === 'mrr' ? value.toFixed(3) : `${(value * 100).toFixed(1)}%`;

  const render = () => {
    const direction = directionInput.value;
    if (!directions.includes(direction) || !metrics.includes(selectedMetric)) return;
    metricButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.metric === selectedMetric)));
    methods.forEach(method => {
      const value = recordFor(method, direction)[selectedMetric];
      document.querySelector(`[data-protein-value="${method}"]`).textContent = formatted(value, selectedMetric);
      const bar = document.querySelector(`[data-protein-bar="${method}"]`);
      bar.style.setProperty('--value', `${value * 100}%`);
      bar.dataset.value = String(value);
    });
    const observed = recordFor('observed_cosine', direction);
    const mainValue = document.querySelector('#protein-primary-value');
    mainValue.replaceChildren(document.createTextNode(selectedMetric === 'mrr' ? observed.mrr.toFixed(3) : (observed[selectedMetric] * 100).toFixed(1)));
    if (selectedMetric !== 'mrr') {
      const unit = document.createElement('span');
      unit.className = 'unit';
      unit.textContent = '%';
      mainValue.append(unit);
    }
    mainValue.dataset.value = String(observed[selectedMetric]);
    document.querySelector('#protein-primary-label').textContent = text[`${selectedMetric}Label`];
    document.querySelector('#protein-primary-count').textContent = selectedMetric === 'mrr'
      ? text.count(observed.queries)
      : text.hits(observed[`${selectedMetric}_hits`], observed.queries);
    document.querySelector('#protein-definition').textContent = text[`${selectedMetric}Definition`];
    document.querySelector('#protein-uniform-reference').textContent = text.reference(formatted(observed.uniform_rank_reference[selectedMetric], selectedMetric));
    document.querySelector('#chart-zero').textContent = selectedMetric === 'mrr' ? '0' : '0%';
    document.querySelector('#chart-full').textContent = selectedMetric === 'mrr' ? '1' : '100%';
    status.textContent = text.showing(text[direction], selectedMetric === 'mrr' ? 'MRR' : selectedMetric === 'top1' ? 'Top 1' : 'Top 5', formatted(observed[selectedMetric], selectedMetric));
  };

  const load = async () => {
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 10000);
    try {
      const response = await fetch('data/protein-summary.json', {signal: abort.signal});
      if (!response.ok) throw new Error('Summary unavailable');
      data = await response.json();
      if (!methods.every(method => directions.every(direction => validRecord(recordFor(method, direction))))) {
        throw new Error('Invalid summary schema');
      }
      metricButtons.forEach(button => button.addEventListener('click', () => {
        selectedMetric = button.dataset.metric;
        render();
      }));
      directionInput.addEventListener('change', render);
      controls.classList.add('is-ready');
      render();
    } catch {
      controls.classList.remove('is-ready');
      status.textContent = text.failure;
    } finally {
      clearTimeout(timeout);
    }
  };
  load();
})();
