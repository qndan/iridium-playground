<script lang="ts">
  import { onDestroy } from "svelte";
  import Button from "./Button.svelte";
  import { code } from "./state.svelte";
  import type { RunStatus } from "./types";

  type Props = {
    theme: "dark" | "light";
    status: RunStatus;
    onToggleTheme: () => void;
  };

  let { theme, status, onToggleTheme }: Props = $props();
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
    <span class="inline-flex items-center gap-1.5 text-11 text-secondary max-mobile:hidden">
      <span
        class={`size-1.75 rounded-full ${
          status === "running"
            ? "bg-status-running shadow-status-running"
            : status === "error"
              ? "bg-status-failed shadow-status-failed"
              : "bg-status-success shadow-status-success"
        }`}
      ></span>
      {status === "scheduled"
        ? "Auto-run on"
        : status === "running"
          ? "Running"
          : status === "error"
            ? "Run failed"
            : "Up to date"}
    </span>
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
  </div>
</header>
