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

<section class="pane" class:scrollable bind:this={element} aria-label={ariaLabel}>
  <div class="pane-heading">
    <h2>{title}</h2>
    {#if headerActions}
      {@render headerActions()}
    {/if}
  </div>
  {@render children()}
</section>

<style>
  .pane {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    background: var(--surface);
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  }

  .pane-heading {
    display: flex;
    min-height: 40px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid var(--border);
  }

  .pane-heading h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.15px;
  }

  .pane.scrollable {
    overflow: auto;
    overscroll-behavior: contain;
  }
</style>
