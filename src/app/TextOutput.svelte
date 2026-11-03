<script lang="ts">
  import Button from "./Button.svelte";
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
    <div class="flex items-center gap-2">
      {#if copyStatus === "error"}
        <span class="text-2xs leading-relaxed text-error-heading-text" aria-live="polite">{copyError}</span>
      {/if}
      <Button
        variant="secondary"
        onclick={copyText}
        ariaLabel="Copy text result"
        title={copyStatus === "error" ? copyError : "Copy text"}
      >
        {#snippet children()}
        {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
        {/snippet}
      </Button>
    </div>
  {/snippet}
  <p class="m-0 whitespace-pre-wrap wrap-anywhere p-4 text-xs leading-copy text-result-text">{output.text}</p>
</ResultCard>
