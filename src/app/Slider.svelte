<script lang="ts">
export type SliderProps = {
  name: string;
  min: number;
  max: number;
  value: number;
};

let {
  name,
  min = $bindable(0),
  max = $bindable(0),
  value = $bindable(0),
}: SliderProps = $props();
const id = $props.id();
</script>

<div class="slider">
  <label class="name" for={id}>{name}</label>
  <input class="range" id={id} name={id} type="range" min={min} max={max} bind:value />

  <label for="{id}-value">Value</label>
  <input class="inputNumber" id="{id}-value" type="number" bind:value={value} />

  <label for="{id}-min">Min</label>
  <input class="inputNumber" id="{id}-min" type="number" bind:value={min} />

  <label for="{id}-max">Max</label>
  <input class="inputNumber" id="{id}-max" type="number" bind:value={max} />
</div>

<style>
.slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.name {
  min-width: 30px;
}

.range {
  flex-grow: 1;
}

.inputNumber {
  width: 56px;
}
</style>
