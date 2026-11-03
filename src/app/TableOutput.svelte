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
  <div class="table-result-wrap">
    <table class="table-result">
      <thead>
        <tr>
          <th scope="col">Row</th>
          {#each output.columnNames as columnName, columnIndex (`${output.id}-header-${columnIndex}`)}
            <th scope="col">{columnName}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each output.rows as row, rowIndex (`${output.id}-row-${rowIndex}`)}
          <tr>
            <th scope="row">{output.rowNames[rowIndex] || rowIndex + 1}</th>
            {#each row as value, columnIndex (`${output.id}-${rowIndex}-${columnIndex}`)}
              <td>{formatValue(value)}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</ResultCard>

<style>
  .table-result-wrap {
    overflow: visible;
  }

  .table-result {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    color: var(--result-text);
    font-family: var(--mono);
    font-size: 10px;
    text-align: right;
    white-space: nowrap;
  }

  .table-result th,
  .table-result td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--list-divider);
  }

  .table-result thead {
    background: var(--result-bg);
  }

  .table-result thead th {
    color: var(--subtle);
    font-weight: 500;
  }

  .table-result thead th:first-child,
  .table-result tbody th {
    position: sticky;
    left: 0;
    background: var(--result-bg);
    text-align: left;
  }

  .table-result tbody th {
    color: var(--list-index);
    font-weight: 400;
  }

  .table-result tbody tr:last-child th,
  .table-result tbody tr:last-child td {
    border-bottom: 0;
  }
</style>
