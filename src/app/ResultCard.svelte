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

<article class="shrink-0 overflow-hidden rounded-panel border border-result-border bg-result-bg">
  <div class="flex min-h-[34px] items-center justify-between border-b border-result-heading-border px-2.75">
    <h3 class="m-0 text-11 font-semibold text-result-heading-text">{title}</h3>
    {#if headerActions}
      {@render headerActions()}
    {:else if badge}
      <span class="font-mono text-3xs tracking-wide text-subtle">{badge}</span>
    {/if}
  </div>
  {@render children()}
</article>
