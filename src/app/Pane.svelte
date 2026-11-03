<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    ariaLabel: string;
    children: Snippet;
    headerActions?: Snippet;
    scrollable?: boolean;
    element?: HTMLElement;
  };

  let {
    title,
    ariaLabel,
    children,
    headerActions,
    scrollable = false,
    element = $bindable(),
  }: Props = $props();
</script>

<section class={`flex min-h-0 min-w-0 flex-col rounded-panel border border-border bg-surface shadow-pane ${scrollable ? "overflow-auto overscroll-contain" : "overflow-hidden"}`} bind:this={element} aria-label={ariaLabel}>
  <div class="flex min-h-10 shrink-0 items-center justify-between border-b border-border px-3">
    <h2 class="m-0 text-xs font-semibold tracking-tight text-primary">{title}</h2>
    {#if headerActions}
      {@render headerActions()}
    {/if}
  </div>
  {@render children()}
</section>
