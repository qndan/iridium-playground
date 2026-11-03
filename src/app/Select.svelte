<script lang="ts">
  import { Select as BitsSelect } from "bits-ui";

  export type SelectOption = {
    value: string;
    label: string;
  };

  type Props = {
    items: SelectOption[];
    value: string;
    ariaLabel: string;
    onValueChange: (value: string) => void;
  };

  let { items, value, ariaLabel, onValueChange }: Props = $props();
</script>

<BitsSelect.Root
  type="single"
  {items}
  {value}
  {onValueChange}
  allowDeselect={false}
>
  <BitsSelect.Trigger class="app-select-trigger" aria-label={ariaLabel}>
    <BitsSelect.Value />
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="m3 4.5 3 3 3-3"></path>
    </svg>
  </BitsSelect.Trigger>
  <BitsSelect.Portal>
    <BitsSelect.Content class="app-select-content" sideOffset={4}>
      <BitsSelect.Viewport>
        {#each items as item (item.value)}
          <BitsSelect.Item
            class="app-select-item"
            value={item.value}
            label={item.label}
          >
            {item.label}
          </BitsSelect.Item>
        {/each}
      </BitsSelect.Viewport>
    </BitsSelect.Content>
  </BitsSelect.Portal>
</BitsSelect.Root>

<style>
  :global(.app-select-trigger) {
    display: inline-flex;
    width: min(220px, 30vw);
    min-width: 0;
    min-height: 27px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 3px 9px;
    border: 1px solid var(--tag-border);
    border-radius: var(--border-radius);
    background: var(--tag-bg);
    color: var(--text-secondary);
    font: inherit;
    font-size: 10px;
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  :global(.app-select-trigger:hover),
  :global(.app-select-trigger:focus-visible),
  :global(.app-select-trigger[data-state="open"]) {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  :global(.app-select-trigger:focus-visible) {
    outline: 2px solid var(--text-secondary);
    outline-offset: 2px;
  }

  :global(.app-select-trigger > span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.app-select-trigger svg) {
    width: 12px;
    height: 12px;
    flex: 0 0 auto;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    transform: rotate(0deg);
    transition: transform 120ms ease;
  }

  :global(.app-select-trigger[data-state="open"] svg) {
    transform: rotate(180deg);
  }

  :global(.app-select-content) {
    z-index: 20;
    max-height: min(320px, var(--bits-select-content-available-height));
    min-width: var(--bits-select-anchor-width);
    overflow: auto;
    padding: 4px;
    border: 1px solid var(--tag-border);
    border-radius: var(--border-radius);
    background: var(--surface-raised);
    color: var(--text-primary);
    box-shadow: 0 6px 20px rgb(0 0 0 / 16%);
  }

  :global(.app-select-item) {
    display: flex;
    min-height: 28px;
    align-items: center;
    padding: 4px 8px;
    border-radius: calc(var(--border-radius) - 1px);
    color: var(--text-secondary);
    font-size: 10px;
    cursor: pointer;
    outline: none;
  }

  :global(.app-select-item[data-highlighted]) {
    background: var(--chip-bg);
    color: var(--text-primary);
  }
</style>
