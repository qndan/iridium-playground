<script lang="ts">
  const apiEntries = [
    {
      name: "Demo.plot(data, title?)",
      description:
        "Plots a NamedArray or an array of numeric columns. For a NamedArray, the first column is the x-axis and the remaining columns become labeled series.",
    },
    {
      name: "Demo.table(data, title?)",
      description:
        "Displays a NamedArray or an array of numeric columns in a scrollable table. Raw columns receive generic names and numbered rows.",
    },
    {
      name: "Demo.text(text)",
      description: "Adds a text result. Values are converted to strings.",
    },
    {
      name: "Demo.list(items, title?)",
      description: "Displays an array as a compact, titled list.",
    },
    {
      name: "Demo.slider(min, max, step, name)",
      description:
        "Adds an interactive slider and returns its current numeric value. The value is remembered by its name, so the same slider keeps its value when your code reruns. Moving it reruns your code with the selected value.",
    },
  ];
</script>

<div class="flex w-full shrink-0 flex-col gap-5 overflow-visible p-4 text-13 leading-copy text-secondary">
  <section class="flex flex-col gap-2">
    <h3 class="m-0 text-[14px] font-semibold text-primary">About the playground</h3>
    <p class="m-0">
      Iridium Playground is a live demo for the Iridium simulator. Edit
      JavaScript on the left and your code reruns automatically after a short
      pause. Results appear here as plots, tables, text, lists, or interactive
      sliders.
    </p>
    <p class="m-0">
      <code class="font-mono text-primary">Iridium</code> and
      <code class="font-mono text-primary">Demo</code> are available without
      imports, and top-level <code class="font-mono text-primary">await</code>
      is supported. Use the example selector above the editor for starting
      points.
    </p>
  </section>

  <section class="flex flex-col gap-2">
    <h3 class="m-0 text-[14px] font-semibold text-primary">Demo API reference</h3>
    <p class="m-0">
      Use these helpers to send output from your code to the Results tab.
    </p>
    <dl class="m-0 flex flex-col divide-y divide-border rounded-panel border border-border bg-surface-soft">
      {#each apiEntries as entry}
        <div class="flex flex-col gap-1 px-3 py-2.75">
          <dt class="font-mono text-primary">{entry.name}</dt>
          <dd class="m-0">{entry.description}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section class="flex flex-col gap-2">
    <h3 class="m-0 text-[14px] font-semibold text-primary">Useful notes</h3>
    <ul class="m-0 list-disc space-y-1.5 pl-4">
      <li>Runtime errors are shown in the Results tab.</li>
      <li>Slider changes rerun the current editor code automatically.</li>
      <li>Use Share in the header to copy a link for the current code.</li>
    </ul>
  </section>
</div>
