<script lang="ts">
  import type { CodeExample } from "./examples";

  type Props = {
    examples: CodeExample[];
    selected: string;
    hasSharedCode: boolean;
    onSelect: (exampleId: string) => void;
  };

  let { examples, selected, hasSharedCode, onSelect }: Props = $props();
</script>

<label class="example-select-wrap">
  <select
    class="example-select"
    value={selected}
    onchange={(event) => onSelect(event.currentTarget.value)}
    aria-label="Select code example"
  >
    {#each examples as example (example.id)}
      <option value={example.id}>{example.name}</option>
    {/each}
    {#if hasSharedCode}
      <option value="shared">Shared code</option>
    {/if}
  </select>
  <svg class="select-chevron" viewBox="0 0 12 12" aria-hidden="true">
    <path d="m3 4.5 3 3 3-3"></path>
  </svg>
</label>

<style>
  .example-select-wrap {
    position: relative;
    display: inline-flex;
    max-width: 220px;
  }

  .example-select {
    max-width: 220px;
    min-width: 0;
    min-height: 27px;
    padding: 3px 30px 3px 8px;
    appearance: none;
    border: 1px solid var(--tag-border);
    border-radius: var(--border-radius);
    background: var(--tag-bg);
    color: var(--text-secondary);
    font: inherit;
    font-size: 10px;
    cursor: pointer;
  }

  .select-chevron {
    position: absolute;
    top: 50%;
    right: 9px;
    width: 12px;
    height: 12px;
    transform: translateY(-50%);
    fill: none;
    stroke: var(--text-secondary);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    pointer-events: none;
  }

  .example-select:hover,
  .example-select:focus-visible {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  .example-select:hover + .select-chevron,
  .example-select:focus-visible + .select-chevron {
    stroke: var(--text-primary);
  }
</style>
