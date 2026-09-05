<script lang="ts">
import { untrack } from "svelte";
import uPlot from "uplot";
import { variables, columns } from "./state.svelte.ts";
import { TIME_NAME } from "antimony-language";

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
const COLORS = [
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "magenta",
];

let container: HTMLDivElement;
let plot;

function getSeries() {
  if (columns.value.length <= 0) {
    return [{}, {}];
  } else {
    return variables.value.map(({name, visible}, i) => (name === TIME_NAME ? {} : {
      label: name,
      stroke: COLORS[(i - 1) % COLORS.length],
      width: 3,
      show: visible,
    }));
  }
}

function getData() {
  if (columns.value.length <= 0) {
    return [[0], [0]]
  } else {
    return $state.snapshot(columns.value).map(col => col.values);
  }
}

$effect(() => {
  const opts = {
    width: untrack(() => width),
    height: untrack(() => height - LEGEND_HEIGHT),

    scales: {
      x: {
        time: false,
      },
    },

    series: getSeries(),
  };

  plot = new uPlot(opts, untrack(getData), container);

  return () => plot.destroy();
});

$effect(() => {
  if (!plot) return;
  plot.setSize({ width, height: height - LEGEND_HEIGHT });
});

$effect(() => {
  if (!plot) return;
  plot.setData(getData());
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
