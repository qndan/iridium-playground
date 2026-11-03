<script lang="ts">
  import * as Iridium from "iridium-simulator";
  import { onMount, tick } from "svelte";
  import CodePanel from "./app/CodePanel.svelte";
  import Plot from "./app/Plot.svelte";
  import { createDemo, type DemoApi, type DemoOutput } from "./app/Demo";
  import { code } from "./app/state.svelte";

  type RunStatus = "scheduled" | "running" | "complete" | "error";
  type UserConsole = Pick<Console, "log" | "info" | "warn" | "error">;

  const outputs = $state<DemoOutput[]>([]);
  const sliderValues = $state<Record<string, number>>({});
  const sliderDraftValues = $state<Record<string, number>>({});
  let theme = $state<"dark" | "light">("dark");
  let status = $state<RunStatus>("scheduled");
  let errorMessage = $state("");
  let shareStatus = $state<"idle" | "copied" | "error">("idle");
  let shareError = $state("");
  let copyFeedback = $state<{ outputId: number; message: string; failed: boolean } | null>(null);
  let scheduledSliderRun: number | undefined;
  let latestRun = 0;
  let resultsPane: HTMLElement;

  onMount(() => {
    const sharedCode = new URLSearchParams(window.location.hash.slice(1)).get("code");
    if (sharedCode !== null) code.value = sharedCode;

    const savedTheme = localStorage.getItem("iridium-playground-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
      document.documentElement.dataset.theme = savedTheme;
    }
  });

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("iridium-playground-theme", theme);
  }

  async function shareCode() {
    const shareUrl = new URL(window.location.href);
    const fragment = new URLSearchParams();
    fragment.set("code", code.value);
    shareUrl.hash = fragment.toString();

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      shareStatus = "copied";
      shareError = "";
    } catch (error) {
      shareStatus = "error";
      shareError = error instanceof Error ? error.message : String(error);
    }
  }

  async function copyText(outputId: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copyFeedback = { outputId, message: "Copied", failed: false };
    } catch (error) {
      copyFeedback = {
        outputId,
        message: `Copy failed: ${error instanceof Error ? error.message : String(error)}`,
        failed: true,
      };
    }
  }

  function displayValue(value: unknown): string {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2) ?? String(value);
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }

  async function execute(source: string) {
    const runId = ++latestRun;
    const previousScrollTop = resultsPane?.scrollTop ?? 0;
    outputs.length = 0;
    errorMessage = "";
    copyFeedback = null;
    status = "running";

    const demo = createDemo(
      (output) => {
        if (runId === latestRun) outputs.push(output);
      },
      sliderValues,
    );
    const userConsole = {
      log: (...values: unknown[]) => demo.text(values.map(displayValue).join(" ")),
      info: (...values: unknown[]) => demo.text(values.map(displayValue).join(" ")),
      warn: (...values: unknown[]) => demo.text(values.map(displayValue).join(" ")),
      error: (...values: unknown[]) => demo.text(values.map(displayValue).join(" ")),
    };

    try {
      const runUserCode = new Function(
        "Iridium",
        "Demo",
        "console",
        `"use strict"; return (async () => {\n${source}\n})();`,
      ) as (
        iridium: typeof Iridium,
        demoApi: DemoApi,
        userConsole: UserConsole,
      ) => Promise<void>;

      await runUserCode(Iridium, demo, userConsole);
      if (runId === latestRun) status = "complete";
    } catch (error) {
      if (runId === latestRun) {
        status = "error";
        errorMessage = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (runId === latestRun && resultsPane) {
        await tick();
        resultsPane.scrollTop = Math.min(
          previousScrollTop,
          resultsPane.scrollHeight - resultsPane.clientHeight,
        );
      }
    }
  }

  function updateSlider(name: string, value: number) {
    sliderDraftValues[name] = value;
    sliderValues[name] = value;
    if (scheduledSliderRun !== undefined) {
      window.clearTimeout(scheduledSliderRun);
    }
    scheduledSliderRun = window.setTimeout(() => {
      scheduledSliderRun = undefined;
      void execute(code.value);
    }, 120);
  }

  function getSliderValue(name: string, initialValue: number): number {
    return sliderDraftValues[name] ?? initialValue;
  }

  $effect(() => {
    const source = code.value;
    latestRun += 1;
    if (scheduledSliderRun !== undefined) {
      window.clearTimeout(scheduledSliderRun);
      scheduledSliderRun = undefined;
    }
    status = "scheduled";
    const timeout = window.setTimeout(() => void execute(source), 500);

    return () => window.clearTimeout(timeout);
  });
</script>

<svelte:head>
  <title>Iridium Playground</title>
  <meta
    name="description"
    content="Write Iridium simulator code and explore the results live."
  />
</svelte:head>

<main class="playground" data-theme={theme}>
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">i</div>
      <div>
        <h1>Iridium Playground</h1>
      </div>
    </div>
    <div class="run-controls">
      <span class:failed={status === "error"} class:running={status === "running"} class="run-status">
        <span class="status-dot"></span>
        {status === "scheduled"
          ? "Auto-run on"
          : status === "running"
            ? "Running"
            : status === "error"
              ? "Run failed"
              : "Up to date"}
      </span>
      <button
        class="share-button"
        onclick={shareCode}
        aria-label={shareStatus === "copied" ? "Share link copied" : "Copy share link"}
        title={shareStatus === "error" ? `Could not copy share link: ${shareError}` : "Copy a link to this code"}
      >
        {shareStatus === "copied" ? "Link copied" : shareStatus === "error" ? "Copy failed" : "Share"}
      </button>
      <button
        class="theme-button"
        onclick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {#if theme === "dark"}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"></path>
          </svg>
        {/if}
      </button>
    </div>
  </header>

  <div class="workspace">
    <section class="pane editor-pane" aria-label="Code editor">
      <div class="pane-heading">
        <div>
          <span class="eyebrow">EDITOR</span>
          <h2>Experiment</h2>
        </div>
        <span class="language-tag">JavaScript</span>
      </div>
      <div class="editor-frame">
        <div class="editor-note">
          <span class="import-chip">Iridium</span>
          <span class="import-chip">Demo</span>
          <span>auto-imported</span>
        </div>
        <CodePanel {theme} />
      </div>
      <div class="editor-footer">
        <span>Changes run automatically</span>
      </div>
    </section>

    <section class="pane results-pane" aria-label="Results panel" bind:this={resultsPane}>
      <div class="pane-heading results-heading">
        <div>
          <span class="eyebrow">OUTPUT</span>
          <h2>Results</h2>
        </div>
        <span class="result-count">{outputs.length} {outputs.length === 1 ? "item" : "items"}</span>
      </div>

      <div class="results-content">
        {#if errorMessage}
          <div class="error-card" role="alert">
            <div class="error-title"><span aria-hidden="true">!</span> Execution error</div>
            <pre>{errorMessage}</pre>
          </div>
        {/if}

        {#if outputs.length === 0 && !errorMessage && status !== "running"}
          <div class="empty-state">
            <div class="empty-icon" aria-hidden="true">↗</div>
            <h3>Your results will appear here</h3>
            <p>Call <code>Demo.plot()</code>, <code>Demo.table()</code>, <code>Demo.text()</code>, <code>Demo.list()</code>, or <code>Demo.slider()</code> in your code.</p>
          </div>
        {:else if outputs.length === 0 && status === "running"}
          <div class="empty-state running-state">
            <div class="loader" aria-hidden="true"></div>
            <h3>Running your code</h3>
            <p>Results will show here as they are generated.</p>
          </div>
        {/if}

        {#each outputs as output (output.id)}
          <article class="result-card">
            {#if output.type === "plot"}
              <div class="result-card-heading">
                <h3>{output.title}</h3>
                <span class="result-type">PLOT</span>
              </div>
              <Plot data={output.data} labels={output.labels} {theme} />
            {:else if output.type === "table"}
              <div class="result-card-heading">
                <h3>{output.title}</h3>
                <span class="result-type">TABLE · {output.rows.length} ROWS</span>
              </div>
              <div class="table-result-wrap">
                <table class="table-result">
                  <thead>
                    <tr>
                      <th scope="col">Row</th>
                      {#each output.columnNames as columnName, columnIndex (`${output.id}-header-${columnIndex}`)}
                        <th scope="col">{columnName}</th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody>
                    {#each output.rows as row, rowIndex (`${output.id}-row-${rowIndex}`)}
                      <tr>
                        <th scope="row">{output.rowNames[rowIndex] || rowIndex + 1}</th>
                        {#each row as value, columnIndex (`${output.id}-${rowIndex}-${columnIndex}`)}
                          <td>{displayValue(value)}</td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else if output.type === "text"}
              <div class="result-card-heading">
                <h3>Text</h3>
                <div class="text-result-actions">
                  {#if copyFeedback?.outputId === output.id && copyFeedback.failed}
                    <span
                      class:error={copyFeedback.failed}
                      class="copy-feedback"
                      aria-live="polite"
                    >{copyFeedback.message}</span>
                  {/if}
                  <button
                    type="button"
                    class="copy-button"
                    onclick={() => copyText(output.id, output.text)}
                    aria-label="Copy text result"
                    title={copyFeedback?.failed && copyFeedback.outputId === output.id
                      ? copyFeedback.message
                      : "Copy text"}
                  >
                    {copyFeedback?.outputId === output.id
                      ? copyFeedback.failed ? "Copy failed" : "Copied"
                      : "Copy"}
                  </button>
                </div>
              </div>
              <p class="text-result">{output.text}</p>
            {:else if output.type === "slider"}
              {@const sliderValue = getSliderValue(output.name, output.value)}
              <div class="result-card-heading">
                <h3>{output.name}</h3>
                <span class="result-type">SLIDER</span>
              </div>
              <div class="slider-result">
                <input
                  type="range"
                  min={output.min}
                  max={output.max}
                  step={output.step}
                  value={sliderValue}
                  style={`--slider-progress: ${
                    output.max === output.min
                      ? 0
                      : ((sliderValue - output.min) / (output.max - output.min)) * 100
                  }%`}
                  aria-label={output.name}
                  oninput={(event) =>
                    (sliderDraftValues[output.name] = event.currentTarget.valueAsNumber)}
                  onchange={(event) =>
                    updateSlider(output.name, event.currentTarget.valueAsNumber)}
                />
                <output>{sliderValue}</output>
              </div>
            {:else}
              <div class="result-card-heading">
                <h3>{output.title}</h3>
                <span class="result-type">LIST · {output.items.length}</span>
              </div>
              <ul class="list-result">
                {#each output.items as item, index (`${output.id}-${index}`)}
                  <li><span class="list-index">{String(index + 1).padStart(2, "0")}</span><code>{displayValue(item)}</code></li>
                {/each}
              </ul>
            {/if}
          </article>
        {/each}
      </div>
    </section>
  </div>
</main>
