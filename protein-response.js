(() => {
  const bins = ["increased", "decreased", "discordant", "within_threshold", "missing"];
  const totalProteins = 15170;
  const select = document.getElementById("response-condition");
  const panel = document.getElementById("response-panel");
  const selected = document.getElementById("response-selected");
  const loading = document.getElementById("response-loading");
  const error = document.getElementById("response-error");
  const similarityStatus = document.getElementById("response-similarity-status");
  const neighborList = document.getElementById("response-neighbors");
  const lang = document.documentElement.lang;
  const isJapanese = lang === "ja";
  const formatNumber = new Intl.NumberFormat(lang);
  const formatPercent = new Intl.NumberFormat(lang, {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const formatSimilarity = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const rows = new Map(bins.map((bin) => {
    const row = panel.querySelector(`[data-bin="${bin}"]`);
    return [bin, {
      count: row.querySelector(".response-count"),
      bar: row.querySelector(".response-bar span"),
    }];
  }));

  function validCondition(condition) {
    if (!condition || typeof condition.id !== "string" || !condition.id.trim() ||
        typeof condition.name !== "string" || !condition.name.trim() ||
        typeof condition.dose !== "string" || !condition.dose.trim() || !condition.counts) {
      return false;
    }
    const counts = bins.map((bin) => condition.counts[bin]);
    return counts.every((count) => Number.isSafeInteger(count) && count >= 0) &&
      counts.reduce((sum, count) => sum + count, 0) === totalProteins;
  }

  function similarityIndex(data, conditions) {
    const minimumShared = 100;
    if (!data || data.schema_version !== 1 || data.min_shared_proteins !== minimumShared ||
        !Array.isArray(data.conditions) || data.conditions.length !== conditions.size) {
      throw new Error("Unexpected similarity data");
    }
    const index = new Map();
    const validShared = (count) => Number.isSafeInteger(count) &&
      count >= minimumShared && count <= totalProteins;
    for (const entry of data.conditions) {
      if (!entry || !conditions.has(entry.id) || index.has(entry.id) ||
          !Number.isSafeInteger(entry.eligible_candidates) ||
          entry.eligible_candidates < 0 || entry.eligible_candidates >= conditions.size ||
          !Array.isArray(entry.neighbors) ||
          entry.neighbors.length !== Math.min(entry.eligible_candidates, 5)) {
        throw new Error("Unexpected similarity conditions");
      }
      const seen = new Set();
      let previousScore = 1;
      for (const neighbor of entry.neighbors) {
        if (!neighbor || neighbor.id === entry.id || !conditions.has(neighbor.id) || seen.has(neighbor.id) ||
            !Number.isFinite(neighbor.similarity) || neighbor.similarity < -1 ||
            neighbor.similarity > previousScore ||
            !validShared(neighbor.shared_r1_r2) || !validShared(neighbor.shared_r2_r1)) {
          throw new Error("Unexpected similarity comparison");
        }
        seen.add(neighbor.id);
        previousScore = neighbor.similarity;
      }
      index.set(entry.id, entry);
    }
    return index;
  }

  function showNeighbors(entry, conditions, choose) {
    const displayed = entry.neighbors.length;
    const eligible = formatNumber.format(entry.eligible_candidates);
    if (!displayed) {
      similarityStatus.textContent = isJapanese
        ? "比較の基準を満たす別の条件はありません。"
        : "No other conditions met the comparison criteria.";
      neighborList.replaceChildren();
      neighborList.hidden = true;
      return;
    }
    similarityStatus.textContent = isJapanese
      ? `${eligible}条件と比較し、類似度の高い${displayed}件を表示しています。`
      : `${eligible} comparable conditions. Showing the closest ${displayed}.`;
    neighborList.replaceChildren(...entry.neighbors.map((neighbor) => {
      const condition = conditions.get(neighbor.id);
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "response-neighbor";
      const label = document.createElement("span");
      label.textContent = `${condition.name} · ${condition.dose}`;
      const score = document.createElement("span");
      score.className = "response-neighbor-score";
      score.textContent = `${isJapanese ? "類似度" : "Similarity"} ${formatSimilarity.format(neighbor.similarity)}`;
      button.append(label, score);
      button.addEventListener("click", () => choose(neighbor.id));
      const shared = document.createElement("p");
      shared.className = "response-neighbor-shared";
      shared.textContent = `${isJapanese ? "共通タンパク質ID数" : "Shared protein IDs"} · R1→R2 ${formatNumber.format(neighbor.shared_r1_r2)} / R2→R1 ${formatNumber.format(neighbor.shared_r2_r1)}`;
      item.append(button, shared);
      return item;
    }));
    neighborList.hidden = false;
  }

  async function loadSimilarities(conditions) {
    const result = await fetch("data/protein-similarity.json");
    if (!result.ok) throw new Error("Similarity data unavailable");
    return similarityIndex(await result.json(), conditions);
  }

  async function load() {
    loading.hidden = false;
    try {
      const result = await fetch("data/protein-response.json");
      if (!result.ok) throw new Error("Summary unavailable");
      const data = await result.json();
      if (data.schema_version !== 1 || data.total_proteins !== totalProteins ||
          data.cell_line !== "MCF7" || data.control !== "DMSO" ||
          data.time_hours !== 12 || data.biological_replicates !== 2 || data.threshold_fold !== 1.5 ||
          !Array.isArray(data.conditions) || data.conditions.length !== 78 ||
          !data.conditions.every(validCondition) ||
          new Set(data.conditions.map((condition) => condition.id)).size !== data.conditions.length) {
        throw new Error("Unexpected summary data");
      }

      const conditions = new Map(data.conditions.map((condition) => [condition.id, condition]));
      select.replaceChildren(...data.conditions.map((condition) =>
        new Option(`${condition.name} · ${condition.dose}`, condition.id)
      ));
      let similarities;

      function render() {
        const condition = conditions.get(select.value);
        for (const [bin, row] of rows) {
          const count = condition.counts[bin];
          const proportion = count / totalProteins;
          const percent = count > 0 && proportion < 0.001
            ? `<${formatPercent.format(0.001)}`
            : formatPercent.format(proportion);
          row.count.textContent = `${formatNumber.format(count)} (${percent})`;
          row.bar.style.width = `${proportion * 100}%`;
        }
        selected.textContent = `${condition.name} · ${condition.dose} · ${isJapanese ? "12時間後 / 2回の生物学的反復" : "12 hours / 2 biological replicates"}`;
        renderNeighbors();
      }

      function renderNeighbors() {
        if (similarities) showNeighbors(similarities.get(select.value), conditions, choose);
      }

      function choose(id) {
        select.value = id;
        render();
        select.focus();
      }

      render();
      select.addEventListener("change", render);
      panel.hidden = false;
      loadSimilarities(conditions).then((index) => {
        similarities = index;
        renderNeighbors();
      }).catch(() => {
        similarityStatus.textContent = isJapanese
          ? "似た条件を読み込めませんでした。実測件数は上で確認できます。"
          : "Similar conditions could not be loaded. The measured counts are available above.";
      });
    } catch {
      error.hidden = false;
    } finally {
      loading.hidden = true;
    }
  }

  load();
})();
