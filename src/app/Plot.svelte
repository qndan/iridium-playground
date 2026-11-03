<script lang="ts">
  import { onDestroy } from "svelte";
  import uPlot from "uplot";

  type Props = {
    data: [number[], ...number[][]];
    labels: string[];
    title: string;
    theme: "dark" | "light";
  };

  let { data, labels, title, theme }: Props = $props();
  let container: HTMLDivElement;
  let width = $state(0);
  let height = $state(0);
  let plot: uPlot | undefined;

  function makeSeries(): uPlot.Series[] {
    const colors = ["#5b67e8", "#10a88a", "#f59e0b", "#e05d78", "#33a6c8", "#9b68cc"];
    return [
      {},
      ...labels.map((label, index) => ({
        label,
        stroke: colors[index % colors.length],
        width: 2,
      })),
    ];
  }

  $effect(() => {
    if (!container || width <= 0 || height <= 0) return;
    const axisColor = theme === "light" ? "#68758a" : "#8290a5";
    const gridColor =
      theme === "light" ? "rgba(104, 117, 138, .18)" : "rgba(130, 144, 165, .14)";
    const instance = new uPlot(
      {
        width,
        height,
        title,
        scales: { x: { time: false } },
        series: makeSeries(),
        axes: [
          { stroke: axisColor, grid: { stroke: gridColor } },
          { stroke: axisColor, grid: { stroke: gridColor } },
        ],
        legend: { show: labels.length > 1 },
      },
      data,
      container,
    );
    plot = instance;
    return () => {
      instance.destroy();
      if (plot === instance) plot = undefined;
    };
  });

  $effect(() => {
    const currentPlot = plot;
    if (currentPlot && width > 0 && height > 0) {
      currentPlot.setSize({ width, height });
    }
  });

  $effect(() => {
    plot?.setData(data);
  });

  onDestroy(() => plot?.destroy());
</script>

<div class="plot-frame" bind:clientWidth={width} bind:clientHeight={height}>
  <div class="plot-target" bind:this={container}></div>
</div>

<style>
  .plot-frame {
    width: 100%;
    height: 300px;
    min-height: 220px;
    overflow: hidden;
  }

  .plot-target {
    width: 100%;
    height: 100%;
  }
</style>
