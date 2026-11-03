export const code = $state({
  value: `// Iridium and Demo modules are automatically imported.
// Iridium has the same API as RoadRunner, but to create a simulator it's
// "await Iridium.createSimulator()" and to load a model it's
// "await sim.load(sbmlString)" or "await sim.loadAntimony(antString)"
// 
// Demo API:
//  - Demo.plot(namedArray, title?): plot named columns or numeric column arrays.
//  - Demo.table(namedArray, title?): display named columns and rows as a table.
//  - Demo.text(text): add a text result.
//  - Demo.list(array, title?): display array items in a compact list.
//  - Demo.slider(min, max, step, name): add a slider and return its current value.

// Create a simulator instance.
const simulator = await Iridium.createSimulator();

// Load a two-step reaction model into the simulator.
await simulator.loadAntimony(\`
A -> B; k1 * A
B -> C; k2 * B
A = 10
B = 0
C = 0
k1 = 0.25
k2 = 0.5
\`);

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
Demo.plot(simulator.simulate(0, 20, 200), "With modified state");`,
});
