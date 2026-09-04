<script lang="ts">
import { untrack } from "svelte";
import uPlot from "uplot";

export type PlotProps = {
  data: number[][];
  width: number;
  height: number;
};

const {
  data,
  width,
  height,
}: PlotProps = $props();

const LEGEND_HEIGHT = 48;

let container: HTMLDivElement;
let plot;

$effect(() => {
  const opts = {
    width: untrack(() => width),
    height: untrack(() => height),

    scales: {
      x: {
        time: false,
      },
    },

    series: [
      {},

      {
        label: "sin(x)",
        stroke: "blue",
        width: 2,
      },

      {
        label: "cos(x)",
        stroke: "red",
        width: 2,
      },

      {
        label: "sin(2x)",
        stroke: "green",
        width: 2,
      },
    ],
  };

  plot = new uPlot(opts, data, container);

  return () => plot.destroy();
});

$effect(() => {
  if (!plot) return;
  plot.setSize({ width, height: height - LEGEND_HEIGHT });
});
</script>

<div class="container2">
  <div class="container" bind:this={container} />
</div>

<style>
.container2 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

.container {
  position: absolute;
  inset: 0;
}
</style>
