<script lang="ts">
  import { formatValue } from "./formatValue";
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    output: Extract<DemoOutput, { type: "table" }>;
  };

  let { output }: Props = $props();
</script>

<ResultCard title={output.title} badge={`TABLE · ${output.rows.length} ROWS`}>
  <div class="max-w-full overflow-x-auto">
    <table class="w-full border-separate border-spacing-0 text-right whitespace-nowrap font-mono text-3xs text-result-text">
      <thead>
        <tr>
          <th class="border-b border-list-divider px-3 py-2 text-left font-medium text-subtle" scope="col">Row</th>
          {#each output.columnNames as columnName, columnIndex (`${output.id}-header-${columnIndex}`)}
            <th class="border-b border-list-divider px-3 py-2 font-medium text-subtle last:border-b-0" scope="col">{columnName}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each output.rows as row, rowIndex (`${output.id}-row-${rowIndex}`)}
          <tr class="last:[&>th]:border-b-0 last:[&>td]:border-b-0">
            <th class="sticky left-0 border-b border-list-divider bg-result-bg px-3 py-2 text-left font-normal text-list-index" scope="row">{output.rowNames[rowIndex] || rowIndex + 1}</th>
            {#each row as value, columnIndex (`${output.id}-${rowIndex}-${columnIndex}`)}
              <td class="border-b border-list-divider px-3 py-2">{formatValue(value)}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</ResultCard>
