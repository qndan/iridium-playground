# Iridium Playground

A browser-based playground for editing and running Iridium simulator code. The
editor reruns code after a short pause, and the results panel displays plots,
tables, text, lists, and interactive sliders.

## Run locally

```sh
npm install
npm run dev
```

## Editor API

`Iridium` (the `iridium-simulator` package) and `Demo` are available in the
editor without import statements. The editor supports top-level `await`.

```js
// Create a simulator instance.
const simulator = await Iridium.createSimulator();

// Load a two-step reaction model into the simulator.
await simulator.loadAntimony(`A -> B; k1 * A
B -> C; k2 * B
A = 10
B = 0
C = 0
k1 = 0.25
k2 = 0.5`);

// Show the model's available ids in the results panel.
Demo.list(simulator.getIds(), "Model ids");

// Run the model and plot its baseline behavior.
Demo.plot(simulator.simulate(0, 20, 200), "A simple reaction");

// Add a slider; its current value is used to change k1 below.
const modifiedK1 = Demo.slider(0, 2, 0.05, "k1 (modified state)");

// Reset to the model's initial state before applying the slider value.
simulator.reset();

// Set k1 to the slider's current value.
simulator.setValue("k1", modifiedK1);

// Run the model again and plot the result with the modified k1.
Demo.plot(simulator.simulate(0, 20, 200), "With modified state");
```

The `Iridium` API matches RoadRunner's, and `Iridium` and `Demo` are available
in the editor without import statements.

Some Iridium calls are asynchronous so WebAssembly can initialize and models
can load without blocking the UI. This async API is subject to change.

- `Demo.plot(namedArray, title?)` plots a simulator `NamedArray`; its first
  column is the x-axis and remaining columns are labeled data series. It also
  accepts an array of numeric columns in the same format.
- `Demo.table(namedArray, title?)` displays the named array's column names,
  row names, and values in a scrollable table.
- `Demo.text(text)` adds a text result.
- `Demo.list(array, title?)` adds a list result.
- `Demo.slider(min, max, step, name)` adds a slider and returns its current
  numeric value. Changing a slider reruns the editor code with that value. In
  the example, it changes `k1` for the second simulation.

Runtime errors are shown in the results panel. Code runs automatically after
you make a change.

Use the theme button in the header to switch between dark and light themes;
your choice is saved in this browser.
