<script lang="ts">
import Slider from "./Slider.svelte";
let sliderValue = $state("0");
</script>

<div class="container">
  <Slider name="k1" min={0} max={10} bind:value={sliderValue} />
  <Slider name="k2" min={0} max={10} bind:value={sliderValue} />
  <Slider name="k3" min={0} max={10} bind:value={sliderValue} />
  <Slider name="k4" min={0} max={10} bind:value={sliderValue} />
  <Slider name="k5" min={0} max={10} bind:value={sliderValue} />
  <Slider name="k6" min={0} max={10} bind:value={sliderValue} />
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
