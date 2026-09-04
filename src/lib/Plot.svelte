<script lang="ts">
export type PlotProps = {
  data: number[][];
};

const {
  data,
  height,
  width,
}: PlotProps = $props();

let canvas = $state();

const colors = [
  "red",
  "blue",
  "green",
  "purple",
  "cyan",
  "yellow",
];

$effect(() => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const xs = data[0];
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const xRange = xMax - xMin;

  const allY = data.slice(1).flat()
  const yMin = allY.reduce((acc, current) => Math.min(acc, current), Infinity);
  const yMax = allY.reduce((acc, current) => Math.max(acc, current), -Infinity);
  const yRange = yMax - yMin;

  for (let i = 1; i < data.length; i++) {
    const ys = data[i];
    ctx.strokeStyle = colors[(i - 1) % colors.length];
    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let j = 0; j < xs.length; j++) {
      const x = Math.round((xs[j] - xMin) / xRange * width) + 0.5;
      const y = Math.round(height - (ys[j] - yMin) / yRange * height) + 0.5;
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
});
</script>

<canvas bind:this={canvas} width={width} height={height} />

<style>
canvas {
  position: absolute;
  background-color: transparent;
}
</style>
