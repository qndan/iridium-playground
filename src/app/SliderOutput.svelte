<script lang="ts">
  import { Slider } from "bits-ui";
  import ResultCard from "./ResultCard.svelte";
  import type { DemoOutput } from "./Demo";

  type Props = {
    output: Extract<DemoOutput, { type: "slider" }>;
    value: number;
    onInput: (name: string, value: number) => void;
    onChange: (name: string, value: number) => void;
  };

  let { output, value, onInput, onChange }: Props = $props();
  let isDragging = $state(false);
</script>

<ResultCard title={output.name} badge="SLIDER">
  <div class="grid grid-cols-slider items-center gap-2.5 px-3 py-2">
    <Slider.Root
      type="single"
      min={output.min}
      max={output.max}
      step={output.step}
      {value}
      class="relative flex h-1.5 w-full touch-none select-none items-center rounded-full bg-slider-track"
      aria-label={output.name}
      onValueChange={(nextValue) => {
        isDragging = true;
        onInput(output.name, nextValue);
      }}
      onValueCommit={(nextValue) => {
        isDragging = false;
        onChange(output.name, nextValue);
      }}
    >
      <Slider.Range class="absolute inset-0 rounded-full bg-slider-fill" />
      <Slider.Thumb
        index={0}
        class={`block size-3.5 appearance-none rounded-full border-0 bg-slider-thumb p-0 shadow-none outline-none transition-transform focus:outline-2 focus:outline-offset-2 focus:outline-slider-thumb ${
          isDragging ? "scale-125 outline-2 outline-offset-2 outline-slider-thumb" : ""
        }`}
      />
    </Slider.Root>
    <output class="min-w-14 rounded-panel border border-result-border bg-surface-soft px-2 py-1.5 text-center font-mono text-11 leading-none text-result-text">{value}</output>
  </div>
</ResultCard>
