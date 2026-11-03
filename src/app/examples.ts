export type CodeExample = {
  id: string;
  name: string;
  source: string;
};

export const examples: CodeExample[] = [
  {
    id: "reaction",
    name: "Reaction with slider",
    source: `// Iridium and Demo modules are automatically imported.
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
const modifiedResults = simulator.simulate(0, 20, 200);
Demo.plot(modifiedResults, "With modified state");

// Uncomment the line below to show CSV.
// Demo.text(modifiedResults.toCsv());`,
  },
  {
    id: "text-list",
    name: "Text and list",
    source: `// Add simple text and list results.
Demo.text("Hello from the Iridium Playground!");
Demo.list(["first item", "second item", "third item"], "Example items");`,
  },
  {
    id: "plot-table",
    name: "Plot and table",
    source: `// Simulate a reaction, then show the results as both a plot and a table.
const simulator = await Iridium.createSimulator();
await simulator.loadAntimony(\`
A -> B; k * A
A = 10
B = 0
k = 0.25
\`);

const results = simulator.simulate(0, 10, 20);
Demo.plot(results, "A to B");
Demo.table(results, "Simulation data");`,
  },
  {
    id: "species-sliders",
    name: "Floating species sliders",
    source: `// Create a simulator and load a model with multiple floating species.
const sim = await Iridium.createSimulator();
await sim.loadAntimony(\`
A -> B; k1 * A
B -> C; k2 * B
A = 10
B = 5
C = 2
k1 = 0.25
k2 = 0.5
\`);

// Make a slider for each floating species and apply its value to the model.
const speciesIds = sim.model.getFloatingSpeciesIds();
for (const speciesId of speciesIds) {
  const initialValue = sim.getValue(speciesId);
  const maxValue = Math.max(initialValue * 2, 1);
  const value = Demo.slider(0, maxValue, maxValue / 100, speciesId);
  sim.setValue(speciesId, value);
}

Demo.plot(sim.simulate(0, 20, 200), "Simulation with adjustable species");`,
  },
];
