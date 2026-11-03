<script lang="ts">
  import EmptyResults from "./EmptyResults.svelte";
  import ErrorCard from "./ErrorCard.svelte";
  import ListOutput from "./ListOutput.svelte";
  import PlotOutput from "./PlotOutput.svelte";
  import SliderOutput from "./SliderOutput.svelte";
  import TableOutput from "./TableOutput.svelte";
  import TextOutput from "./TextOutput.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    outputs: DemoOutput[];
    errorMessage: string;
    theme: "dark" | "light";
    sliderDraftValues: Record<string, number>;
    onSliderInput: (name: string, value: number) => void;
    onSliderChange: (name: string, value: number) => void;
  };

  let {
    outputs,
    errorMessage,
    theme,
    sliderDraftValues,
    onSliderInput,
    onSliderChange,
  }: Props = $props();
</script>

<div class="flex w-full shrink-0 flex-col gap-3 overflow-visible p-4">
  {#if errorMessage}
    <ErrorCard message={errorMessage} />
  {/if}

  {#if outputs.length === 0 && !errorMessage}
    <EmptyResults />
  {/if}

  {#each outputs as output (output.id)}
    {#if output.type === "plot"}
      <PlotOutput {output} {theme} />
    {:else if output.type === "table"}
      <TableOutput {output} />
    {:else if output.type === "text"}
      <TextOutput {output} />
    {:else if output.type === "slider"}
      <SliderOutput
        {output}
        value={sliderDraftValues[output.name] ?? output.value}
        onInput={onSliderInput}
        onChange={onSliderChange}
      />
    {:else}
      <ListOutput {output} />
    {/if}
  {/each}
</div>
