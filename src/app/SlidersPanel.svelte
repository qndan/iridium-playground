<script lang="ts">
import { variables } from "./state.svelte.ts";
import Slider from "./Slider.svelte";
let sliderValue = $state("0");
</script>

<div class="container">
  {#each variables.value as variable}
    {#if "value" in variable}
      <Slider name={variable.name} min={0} max={10} bind:value={variable.value} />
    {/if}
  {/each}
</div>

<style>
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  height: 100%;
}
</style>
