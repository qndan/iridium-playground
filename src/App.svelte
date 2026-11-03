<script lang="ts">
  import * as Iridium from "iridium-simulator";
  import { onMount, tick } from "svelte";
  import CodePanel from "./app/CodePanel.svelte";
  import ExampleSelector from "./app/ExampleSelector.svelte";
  import Pane from "./app/Pane.svelte";
  import ResultsPanel from "./app/ResultsPanel.svelte";
  import TopBar from "./app/TopBar.svelte";
  import { createDemo, type DemoApi, type DemoOutput } from "./app/Demo";
  import { examples } from "./app/examples";
  import { formatValue } from "./app/formatValue";
  import { code } from "./app/state.svelte";
  import type { RunStatus } from "./app/types";

  type UserConsole = Pick<Console, "log" | "info" | "warn" | "error">;

  const outputs = $state<DemoOutput[]>([]);
  const sliderValues = $state<Record<string, number>>({});
  const sliderDraftValues = $state<Record<string, number>>({});
  let theme = $state<"dark" | "light">("dark");
  let selectedExample = $state(examples[0].id);
  let hasSharedCode = $state(false);
  const exampleDrafts = $state<Record<string, string>>({});
  let status = $state<RunStatus>("scheduled");
  let errorMessage = $state("");
  let scheduledSliderRun: number | undefined;
  let latestRun = 0;
  let resultsPane = $state<HTMLElement>();

  onMount(() => {
    const sharedCode = new URLSearchParams(window.location.hash.slice(1)).get("code");
    if (sharedCode !== null) {
      selectedExample = "shared";
      hasSharedCode = true;
      exampleDrafts.shared = sharedCode;
      code.value = sharedCode;
    }

    const savedTheme = localStorage.getItem("iridium-playground-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
      document.documentElement.dataset.theme = savedTheme;
    }
  });

  function selectExample(exampleId: string): void {
    if (exampleId === selectedExample) return;

    const example = examples.find(({ id }) => id === exampleId);
    const nextSource = exampleDrafts[exampleId] ?? example?.source;
    if (nextSource === undefined) return;

    exampleDrafts[selectedExample] = code.value;
    selectedExample = exampleId;
    code.value = nextSource;
  }

  function toggleTheme(): void {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("iridium-playground-theme", theme);
  }

  async function execute(source: string) {
    const runId = ++latestRun;
    const previousScrollTop = resultsPane?.scrollTop ?? 0;
    const nextOutputs: DemoOutput[] = [];
    let nextErrorMessage = "";
    status = "running";

    const demo = createDemo(
      (output) => {
        if (runId === latestRun) nextOutputs.push(output);
      },
      sliderValues,
    );
    const userConsole = {
      log: (...values: unknown[]) => demo.text(values.map(formatValue).join(" ")),
      info: (...values: unknown[]) => demo.text(values.map(formatValue).join(" ")),
      warn: (...values: unknown[]) => demo.text(values.map(formatValue).join(" ")),
      error: (...values: unknown[]) => demo.text(values.map(formatValue).join(" ")),
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
        nextErrorMessage = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (runId === latestRun) {
        outputs.splice(0, outputs.length, ...nextOutputs);
        errorMessage = nextErrorMessage;
      }
      if (runId === latestRun && resultsPane) {
        await tick();
        resultsPane.scrollTop = Math.min(
          previousScrollTop,
          resultsPane.scrollHeight - resultsPane.clientHeight,
        );
      }
    }
  }

  function updateSlider(name: string, value: number): void {
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

  function updateSliderDraft(name: string, value: number): void {
    sliderDraftValues[name] = value;
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

<main class="mx-auto flex h-screen h-dvh min-h-0 w-full max-w-playground flex-col overflow-hidden bg-transparent px-2 pt-1.5 pb-2 max-app:px-2.5 max-app:pt-2 max-app:pb-2.5 max-mobile:p-1.5" data-theme={theme}>
  <TopBar {theme} {status} onToggleTheme={toggleTheme} />

  <div class="grid min-h-0 flex-1 grid-cols-playground gap-2 max-app:grid-cols-1 max-app:grid-rows-2 max-app:gap-3">
    <Pane title="Code" ariaLabel="Code editor">
      {#snippet headerActions()}
        <ExampleSelector
          {examples}
          selected={selectedExample}
          {hasSharedCode}
          onSelect={selectExample}
        />
      {/snippet}
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-soft">
        <CodePanel {theme} />
      </div>
    </Pane>

    <Pane
      title="Results"
      ariaLabel="Results panel"
      scrollable
      bind:element={resultsPane}
    >
      {#snippet headerActions()}
        <span class="rounded-panel border border-tag-border bg-tag-bg px-1.75 py-1 text-[9px] text-secondary font-mono">{outputs.length} {outputs.length === 1 ? "item" : "items"}</span>
      {/snippet}
      <ResultsPanel
        {outputs}
        {errorMessage}
        {theme}
        {sliderDraftValues}
        onSliderInput={updateSliderDraft}
        onSliderChange={updateSlider}
      />
    </Pane>
  </div>
</main>
