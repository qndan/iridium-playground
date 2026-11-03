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
  <ul class="list-result">
    {#each output.items as item, index (`${output.id}-${index}`)}
      <li>
        <span class="list-index">{String(index + 1).padStart(2, "0")}</span>
        <code>{formatValue(item)}</code>
      </li>
    {/each}
  </ul>
</ResultCard>

<style>
  .list-result {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
    gap: 4px 8px;
    margin: 0;
    padding: 8px 8px;
    list-style: none;
  }

  .list-result li {
    display: flex;
    min-width: 0;
    min-height: 28px;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid var(--result-border);
    border-radius: var(--border-radius);
    background: var(--list-item-bg);
  }

  .list-index {
    color: var(--list-index);
    font-family: var(--mono);
    font-size: 9px;
  }

  .list-result code {
    min-width: 0;
    overflow: hidden;
    color: var(--list-text);
    font-family: var(--mono);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: pre;
  }
</style>
