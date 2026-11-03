<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    badge?: string;
    headerActions?: Snippet;
    children: Snippet;
  };

  let { title, badge, headerActions, children }: Props = $props();
</script>

<article class="result-card">
  <div class="result-card-heading">
    <h3>{title}</h3>
    {#if headerActions}
      {@render headerActions()}
    {:else if badge}
      <span class="result-type">{badge}</span>
    {/if}
  </div>
  {@render children()}
</article>

<style>
  .result-card {
    flex: 0 0 auto;
    overflow: hidden;
    border: 1px solid var(--result-border);
    border-radius: var(--border-radius);
    background: var(--result-bg);
  }

  .result-card-heading {
    display: flex;
    min-height: 34px;
    align-items: center;
    justify-content: space-between;
    padding: 0 11px;
    border-bottom: 1px solid var(--result-heading-border);
  }

  .result-card-heading h3 {
    margin: 0;
    color: var(--result-heading-text);
    font-size: 11px;
    font-weight: 600;
  }

  .result-type {
    color: var(--subtle);
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.4px;
  }
</style>
