<script lang="ts">
  import Plot from "./Plot.svelte";
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    output: Extract<DemoOutput, { type: "plot" }>;
    theme: "dark" | "light";
  };

  let { output, theme }: Props = $props();
</script>

<ResultCard title={output.title} badge="PLOT">
  <Plot data={output.data} labels={output.labels} {theme} />
</ResultCard>
