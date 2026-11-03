<script lang="ts">
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type TextOutputData = Extract<DemoOutput, { type: "text" }>;
  type Props = {
    output: TextOutputData;
  };

  let { output }: Props = $props();
  let copyStatus = $state<"idle" | "copied" | "error">("idle");
  let copyError = $state("");

  $effect(() => {
    output;
    copyStatus = "idle";
    copyError = "";
  });

  async function copyText() {
    try {
      await navigator.clipboard.writeText(output.text);
      copyStatus = "copied";
      copyError = "";
    } catch (error) {
      copyStatus = "error";
      copyError = error instanceof Error ? error.message : String(error);
    }
  }
</script>

<ResultCard title="Text">
  {#snippet headerActions()}
    <div class="text-result-actions">
      {#if copyStatus === "error"}
        <span class="copy-feedback error" aria-live="polite">{copyError}</span>
      {/if}
      <button
        type="button"
        class="copy-button"
        onclick={copyText}
        aria-label="Copy text result"
        title={copyStatus === "error" ? copyError : "Copy text"}
      >
        {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
      </button>
    </div>
  {/snippet}
  <p class="text-result">{output.text}</p>
</ResultCard>

<style>
  .text-result-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .copy-button {
    min-height: 25px;
    padding: 0 8px;
    border: 1px solid var(--result-border);
    border-radius: var(--border-radius);
    background: var(--surface-soft);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 10px;
    transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .copy-button:hover {
    color: var(--text-primary);
    background-color: color-mix(in srgb, var(--surface-soft) 96%, var(--text-primary) 4%);
    border-color: color-mix(in srgb, var(--result-border) 92%, var(--text-primary) 8%);
  }

  .copy-feedback {
    color: var(--chip-text);
    font-size: 10px;
    line-height: 1.6;
  }

  .copy-feedback.error {
    color: var(--error-heading-text);
  }

  .text-result {
    margin: 0;
    padding: 15px;
    color: var(--result-text);
    font-size: 12px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
