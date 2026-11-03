<script lang="ts">
  import { onDestroy } from "svelte";
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

<header class="topbar">
  <div class="brand">
    <div class:inverted={theme === "dark"} class="brand-mark" aria-hidden="true">i</div>
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
      title={shareStatus === "error"
        ? `Could not copy share link: ${shareError}`
        : "Copy a link to this code"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <path d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.2"></path>
      </svg>
      {shareStatus === "copied" ? "Link copied" : shareStatus === "error" ? "Copy failed" : "Share"}
    </button>
    <button
      class="theme-button"
      onclick={onToggleTheme}
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

<style>
  .topbar {
    display: flex;
    min-height: 28px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .brand,
  .run-controls {
    display: flex;
    align-items: center;
  }

  .brand {
    gap: 8px;
  }

  .brand-mark {
    display: grid;
    width: 21px;
    height: 21px;
    place-items: center;
    border: 1px solid #343537;
    border-radius: var(--border-radius);
    background: linear-gradient(145deg, #3a3b3d, #252627);
    color: #d2d2d2;
    font-family: Georgia, serif;
    font-size: 14px;
    font-style: italic;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
  }

  .brand-mark.inverted {
    border-color: #d2d2d2;
    background: linear-gradient(145deg, #f0f0f0, #c8c8c8);
    color: #252627;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 70%);
  }

  .brand h1 {
    margin: 0;
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  .run-controls {
    gap: 8px;
  }

  .share-button {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 11px;
    border: 1px solid var(--tag-border);
    border-radius: var(--border-radius);
    background: var(--surface-raised);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    transition: background-color 120ms ease, border-color 120ms ease;
  }

  .share-button svg {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  .share-button:hover,
  .theme-button:hover {
    background-color: color-mix(in srgb, var(--surface-raised) 96%, var(--text-primary) 4%);
    border-color: color-mix(in srgb, var(--border) 92%, var(--text-primary) 8%);
  }

  .run-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-secondary);
    font-size: 11px;
  }

  .theme-button {
    display: grid;
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .theme-button:hover {
    color: var(--text-primary);
  }

  .theme-button svg {
    width: 15px;
    height: 15px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.7;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #47cba1;
    box-shadow: 0 0 4px rgb(71 203 161 / 24%);
  }

  .run-status.running .status-dot {
    background: #e3b65e;
    box-shadow: 0 0 4px rgb(227 182 94 / 28%);
  }

  .run-status.failed .status-dot {
    background: #ed6b79;
    box-shadow: 0 0 4px rgb(237 107 121 / 28%);
  }

  @media (max-width: 520px) {
    .run-controls {
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }

    .run-status {
      display: none;
    }

    .theme-button {
      width: 30px;
      height: 30px;
    }
  }
</style>
