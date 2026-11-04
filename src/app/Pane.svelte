<script lang="ts">
  import type { Snippet } from "svelte";
  import type { RunStatus } from "./types";

  type Props = {
    title: string;
    ariaLabel: string;
    status?: RunStatus;
    children: Snippet;
    headerActions?: Snippet;
    scrollable?: boolean;
    element?: HTMLElement;
  };

  let {
    title,
    ariaLabel,
    status,
    children,
    headerActions,
    scrollable = false,
    element = $bindable(),
  }: Props = $props();
</script>

<section class={`flex min-h-0 min-w-0 flex-col rounded-panel border border-border bg-surface shadow-pane ${scrollable ? "overflow-auto overscroll-contain" : "overflow-hidden"}`} bind:this={element} aria-label={ariaLabel}>
  <div class="flex min-h-10 shrink-0 items-center justify-between border-b border-border pl-3 pr-2">
    <h2 class="m-0 flex items-center gap-1.5 text-xs font-semibold tracking-tight text-primary">
      {title}
      {#if status === "scheduled" || status === "running"}
        <svg
          class="size-3 animate-spin text-secondary"
          viewBox="0 0 24 24"
          fill="none"
          aria-label={status === "scheduled" ? "Results update scheduled" : "Results updating"}
          role="status"
        >
          <circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
          <path class="opacity-90" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        </svg>
      {:else if status === "error"}
        <svg
          class="size-3 text-status-failed"
          viewBox="0 0 24 24"
          fill="none"
          aria-label="Results update failed"
          role="img"
        >
          <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        </svg>
      {/if}
    </h2>
    {#if headerActions}
      {@render headerActions()}
    {/if}
  </div>
  {@render children()}
</section>
