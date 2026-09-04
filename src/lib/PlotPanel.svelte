<script lang="ts">
import Plot from "./Plot.svelte";

let width = $state(0);
let height = $state(0);

const x = Array.from({ length: 628 }, (_, i) => i / 10);
const data = [
  x,
  x.map(Math.sin),
  x.map(Math.cos),
  x.map(v => Math.sin(v * 2)),
];

</script>

<div class="container" bind:clientWidth={width} bind:clientHeight={height}>
  <Plot width={width} height={height} data={data} />
</div>

<style>
.container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0;
  padding: 0;
  margin: 0;

  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}
</style>
