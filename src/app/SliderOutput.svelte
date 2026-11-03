<script lang="ts">
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    output: Extract<DemoOutput, { type: "slider" }>;
    value: number;
    onInput: (name: string, value: number) => void;
    onChange: (name: string, value: number) => void;
  };

  let { output, value, onInput, onChange }: Props = $props();
</script>

<ResultCard title={output.name} badge="SLIDER">
  <div class="grid grid-cols-slider items-center gap-3.5 p-4">
    <input
      type="range"
      min={output.min}
      max={output.max}
      step={output.step}
      {value}
      style={`--slider-progress: ${
        output.max === output.min ? 0 : ((value - output.min) / (output.max - output.min)) * 100
      }%`}
      class="m-0 h-[18px] w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slider-thumb [&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:border [&::-webkit-slider-runnable-track]:border-result-border [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--slider-fill)_0%,var(--slider-fill)_var(--slider-progress),var(--slider-track)_var(--slider-progress),var(--slider-track)_100%)] [&::-moz-range-track]:h-[5px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:border [&::-moz-range-track]:border-result-border [&::-moz-range-track]:bg-slider-track [&::-moz-range-progress]:h-[5px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-slider-fill [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-result-bg [&::-webkit-slider-thumb]:bg-slider-thumb [&::-webkit-slider-thumb]:shadow-slider-thumb [&::-moz-range-thumb]:size-[11px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-result-bg [&::-moz-range-thumb]:bg-slider-thumb [&::-moz-range-thumb]:shadow-slider-thumb"
      aria-label={output.name}
      oninput={(event) => onInput(output.name, event.currentTarget.valueAsNumber)}
      onchange={(event) => onChange(output.name, event.currentTarget.valueAsNumber)}
    />
    <output class="min-w-16 rounded-panel border border-result-border bg-surface-soft px-2 py-1.5 text-center font-mono text-11 text-result-text">{value}</output>
  </div>
</ResultCard>
