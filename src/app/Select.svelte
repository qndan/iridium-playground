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
  <BitsSelect.Trigger
    class="group inline-flex w-example-select min-w-0 min-h-7 items-center justify-between gap-3 rounded-panel border border-tag-border bg-tag-bg px-2 text-left text-2xs text-secondary transition-colors hover:border-secondary hover:text-primary focus-visible:border-secondary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary data-[state=open]:border-secondary data-[state=open]:text-primary"
    aria-label={ariaLabel}
  >
    <BitsSelect.Value class="min-w-0 flex-1 truncate" />
    <svg class="size-3 shrink-0 fill-none stroke-current transition-transform [stroke-width:1.5] [stroke-linecap:round] [stroke-linejoin:round] group-data-[state=open]:rotate-180" viewBox="0 0 12 12" aria-hidden="true">
      <path d="m3 4.5 3 3 3-3"></path>
    </svg>
  </BitsSelect.Trigger>
  <BitsSelect.Portal>
    <BitsSelect.Content class="z-20 max-h-select-menu min-w-select-menu overflow-auto rounded-panel border border-tag-border bg-surface-raised p-1 text-primary shadow-select" sideOffset={4}>
      <BitsSelect.Viewport>
        {#each items as item (item.value)}
          <BitsSelect.Item
            class="flex min-h-7 cursor-pointer items-center rounded-sm px-2 py-1 text-2xs text-secondary outline-none data-[highlighted]:bg-chip-bg data-[highlighted]:text-primary"
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
