(() => {
  const bins = ["increased", "decreased", "discordant", "within_threshold", "missing"];
  const totalProteins = 15170;
  const select = document.getElementById("response-condition");
  const panel = document.getElementById("response-panel");
  const selected = document.getElementById("response-selected");
  const loading = document.getElementById("response-loading");
  const error = document.getElementById("response-error");
  const formatNumber = new Intl.NumberFormat(document.documentElement.lang);
  const formatPercent = new Intl.NumberFormat(document.documentElement.lang, {
    style: "percent",
    maximumFractionDigits: 1,
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
        selected.textContent = `${condition.name} · ${condition.dose} · ${document.documentElement.lang === "ja" ? "12時間後 / 2回の生物学的反復" : "12 hours / 2 biological replicates"}`;
      }

      render();
      select.addEventListener("change", render);
      panel.hidden = false;
    } catch {
      error.hidden = false;
    } finally {
      loading.hidden = true;
    }
  }

  load();
})();
