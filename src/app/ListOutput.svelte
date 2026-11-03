<script lang="ts">
  import { formatValue } from "./formatValue";
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    output: Extract<DemoOutput, { type: "list" }>;
  };

  let { output }: Props = $props();
</script>

<ResultCard title={output.title} badge={`LIST · ${output.items.length}`}>
  <ul class="m-0 grid grid-cols-list gap-x-2 gap-y-1 p-2 list-none">
    {#each output.items as item, index (`${output.id}-${index}`)}
      <li class="flex min-h-7 min-w-0 items-center gap-2 rounded-panel border border-result-border bg-list-item-bg px-2 py-1.5">
        <span class="font-mono text-3xs text-list-index">{String(index + 1).padStart(2, "0")}</span>
        <code class="min-w-0 overflow-hidden text-ellipsis whitespace-pre font-mono text-2xs text-list-text">{formatValue(item)}</code>
      </li>
    {/each}
  </ul>
</ResultCard>
