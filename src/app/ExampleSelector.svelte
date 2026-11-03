<script lang="ts">
  import Select, { type SelectOption } from "./Select.svelte";
  import type { CodeExample } from "./examples";

  type Props = {
    examples: CodeExample[];
    selected: string;
    hasSharedCode: boolean;
    onSelect: (exampleId: string) => void;
  };

  let { examples, selected, hasSharedCode, onSelect }: Props = $props();
  let items = $derived<SelectOption[]>([
    ...examples.map(({ id, name }) => ({ value: id, label: name })),
    ...(hasSharedCode ? [{ value: "shared", label: "Shared code" }] : []),
  ]);
</script>

<Select
  {items}
  value={selected}
  ariaLabel="Select code example"
  onValueChange={onSelect}
/>
