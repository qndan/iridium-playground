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

<div class="results-content">
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

<style>
  .results-content {
    display: flex;
    width: 100%;
    min-height: auto;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 12px;
    overflow: visible;
    padding: 16px;
  }
</style>
