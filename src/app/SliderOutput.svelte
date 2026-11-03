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
  <div class="slider-result">
    <input
      type="range"
      min={output.min}
      max={output.max}
      step={output.step}
      {value}
      style={`--slider-progress: ${
        output.max === output.min ? 0 : ((value - output.min) / (output.max - output.min)) * 100
      }%`}
      aria-label={output.name}
      oninput={(event) => onInput(output.name, event.currentTarget.valueAsNumber)}
      onchange={(event) => onChange(output.name, event.currentTarget.valueAsNumber)}
    />
    <output>{value}</output>
  </div>
</ResultCard>

<style>
  .slider-result {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 64px;
    align-items: center;
    gap: 14px;
    padding: 16px;
  }

  .slider-result input {
    width: 100%;
    height: 18px;
    margin: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  .slider-result input::-webkit-slider-runnable-track {
    height: 5px;
    border: 1px solid var(--result-border);
    border-radius: 999px;
    background: linear-gradient(
      to right,
      var(--slider-fill) 0%,
      var(--slider-fill) var(--slider-progress),
      var(--slider-track) var(--slider-progress),
      var(--slider-track) 100%
    );
  }

  .slider-result input::-moz-range-track {
    height: 5px;
    border: 1px solid var(--result-border);
    border-radius: 999px;
    background: var(--slider-track);
  }

  .slider-result input::-moz-range-progress {
    height: 5px;
    border-radius: 999px;
    background: var(--slider-fill);
  }

  .slider-result input::-webkit-slider-thumb {
    width: 15px;
    height: 15px;
    margin-top: -6px;
    appearance: none;
    border: 2px solid var(--result-bg);
    border-radius: 50%;
    background: var(--slider-thumb);
    box-shadow: 0 0 0 1px var(--slider-thumb);
  }

  .slider-result input::-moz-range-thumb {
    width: 11px;
    height: 11px;
    border: 2px solid var(--result-bg);
    border-radius: 50%;
    background: var(--slider-thumb);
    box-shadow: 0 0 0 1px var(--slider-thumb);
  }

  .slider-result input:focus-visible {
    outline: 2px solid var(--slider-thumb);
    outline-offset: 4px;
  }

  .slider-result output {
    min-width: 64px;
    padding: 6px 8px;
    border: 1px solid var(--result-border);
    border-radius: var(--border-radius);
    background: var(--surface-soft);
    color: var(--result-text);
    font-family: var(--mono);
    font-size: 11px;
    text-align: center;
  }
</style>
