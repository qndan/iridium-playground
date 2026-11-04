<script lang="ts">
  import { onDestroy } from "svelte";
  import Button from "./Button.svelte";
  import { code } from "./state.svelte";

  type Props = {
    theme: "dark" | "light";
    onToggleTheme: () => void;
  };

  let { theme, onToggleTheme }: Props = $props();
  let shareStatus = $state<"idle" | "copied" | "error">("idle");
  let shareError = $state("");
  let shareResetTimer: number | undefined;

  async function shareCode() {
    if (shareResetTimer !== undefined) window.clearTimeout(shareResetTimer);

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

    shareResetTimer = window.setTimeout(() => {
      shareStatus = "idle";
      shareError = "";
      shareResetTimer = undefined;
    }, 2000);
  }

  onDestroy(() => {
    if (shareResetTimer !== undefined) window.clearTimeout(shareResetTimer);
  });
</script>

<header class="mb-1.5 flex min-h-7 shrink-0 items-center justify-between">
  <div class="flex items-center gap-2">
    <div
      class={`grid size-5.25 place-items-center rounded-panel border bg-linear-to-br font-serif text-[14px] italic ${
        theme === "dark"
          ? "border-neutral-300 from-neutral-100 to-neutral-300 text-neutral-800 shadow-brand-mark-inverted"
          : "border-neutral-700 from-neutral-700 to-neutral-800 text-neutral-300 shadow-brand-mark"
      }`}
      aria-hidden="true"
    >i</div>
    <div>
      <h1 class="m-0 text-13 font-semibold tracking-tight text-primary">Iridium Playground</h1>
    </div>
  </div>
  <div class="flex items-center gap-2 max-mobile:gap-1.5">
    <Button
      variant="primary"
      onclick={shareCode}
      ariaLabel={shareStatus === "copied" ? "Share link copied" : "Copy share link"}
      title={shareStatus === "error"
        ? `Could not copy share link: ${shareError}`
        : "Copy a link to this code"}
    >
      {#snippet children()}
      <svg class="size-3.5 shrink-0 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <path d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.2"></path>
      </svg>
      {shareStatus === "copied" ? "Link copied" : shareStatus === "error" ? "Copy failed" : "Share"}
      {/snippet}
    </Button>
    <Button
      variant="icon"
      onclick={onToggleTheme}
      ariaLabel={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {#snippet children()}
      {#if theme === "dark"}
        <svg class="size-[15px] shrink-0 fill-none stroke-current [stroke-width:1.7] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
        </svg>
      {:else}
        <svg class="size-[15px] shrink-0 fill-none stroke-current [stroke-width:1.7] [stroke-linecap:round] [stroke-linejoin:round]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"></path>
        </svg>
      {/if}
      {/snippet}
    </Button>
    <a
      class="inline-flex size-7 items-center justify-center rounded-panel border border-border bg-surface text-secondary hover:border-button-border-hover hover:bg-button-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      href="https://github.com/qndan/iridium-playground"
      target="_blank"
      rel="noreferrer"
      aria-label="Open Iridium Playground on GitHub"
      title="Open Iridium Playground on GitHub"
    >
      <svg class="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .7a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1.1.1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .7Z"></path>
      </svg>
    </a>
  </div>
</header>
