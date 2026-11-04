<script lang="ts">
  import { Tabs } from "bits-ui";
  import * as Iridium from "iridium-simulator";
  import { onMount, tick } from "svelte";
  import CodePanel from "./app/CodePanel.svelte";
  import ExampleSelector from "./app/ExampleSelector.svelte";
  import HelpPanel from "./app/HelpPanel.svelte";
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
  let resultsTab = $state<"results" | "help">("results");
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
    document.documentElement.classList.add("theme-switching");
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("iridium-playground-theme", theme);
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-switching");
    }, 50);
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
  <TopBar {theme} onToggleTheme={toggleTheme} />

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
      title={resultsTab === "results" ? "Results" : "Help"}
      ariaLabel={resultsTab === "results" ? "Results panel" : "Help panel"}
      status={resultsTab === "results" ? status : undefined}
      scrollable
      bind:element={resultsPane}
    >
      {#snippet headerActions()}
        <Tabs.Root
          bind:value={resultsTab}
          class="tab-switcher flex items-center rounded-panel border border-tag-border bg-surface-soft p-px"
          aria-label="Results panel views"
        >
          <Tabs.List class="flex items-center gap-px">
            <Tabs.Trigger
              value="results"
              class={`tab-switcher-trigger min-h-6.25 rounded-[3px] px-2 text-[10px] hover:text-primary ${
                theme === "dark"
                  ? "font-medium text-secondary data-[state=active]:bg-tag-bg data-[state=active]:font-semibold data-[state=active]:text-primary"
                  : "bg-tag-bg font-semibold text-primary data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-secondary"
              }`}
            >
              Results
              <span class="ml-0.5 font-mono text-[9px] text-subtle">({outputs.length})</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="help"
              class={`tab-switcher-trigger min-h-6.25 rounded-[3px] px-2 text-[10px] hover:text-primary ${
                theme === "dark"
                  ? "font-medium text-secondary data-[state=active]:bg-tag-bg data-[state=active]:font-semibold data-[state=active]:text-primary"
                  : "bg-tag-bg font-semibold text-primary data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-secondary"
              }`}
            >
              Help
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      {/snippet}
      {#if resultsTab === "results"}
        <ResultsPanel
          {outputs}
          {errorMessage}
          {theme}
          {sliderDraftValues}
          onSliderInput={updateSliderDraft}
          onSliderChange={updateSlider}
        />
      {:else}
        <HelpPanel />
      {/if}
    </Pane>
  </div>
</main>

<style>
  :global(.tab-switcher-trigger) {
    transition:
      background-color 140ms ease-out,
      color 140ms ease-out,
      transform 140ms ease-out;
  }

  :global(.tab-switcher-trigger:active) {
    transform: scale(0.96);
  }

  :global(.theme-switching),
  :global(.theme-switching *) {
    transition:
      background-color 0s,
      border-color 0s ease,
      color 0s !important;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.tab-switcher-trigger) {
      transition: none;
    }
  }
</style>
