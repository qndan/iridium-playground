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

// Check out the help menu in the top-right for more info.

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
    id: "sbml",
    name: "Loading SBML from Biomodels",
    source: `// Fetch an SBML model from the Biomodels repository.
// "await" pauses this example until the web request has finished.
const resp = await fetch("https://www.biomodels.org/services/download/get-files/MODEL6622455387/4/BIOMD0000000042_url.xml");
// Read the downloaded response as text because load() expects an SBML string.
const sbml = await resp.text();

// Create a simulator and load the downloaded SBML model.
const simulator = await Iridium.createSimulator();
await simulator.load(sbml);

// Simulate from time 0 to 100 using 200 evenly spaced time points.
const result = simulator.simulate(0, 100, 200);

// Show the same simulation data as both a chart and a table.
Demo.plot(result, "BIOMD0000000042");
Demo.table(result, "Simulation data");`,
  },
  {
    id: "selection-list",
    name: "Selection list",
    source: `// Create a small model with two species and one rate parameter.
const sim = await Iridium.createSimulator();
await sim.loadAntimony(\`
S -> P; rate * S
S = 12
P = 0
rate = 0.3
\`);

// The optional fourth argument chooses which columns appear in the results.
// Here we keep time, S, and P instead of every model value.
const selectedResults = sim.simulate(0, 10, 12, ["time", "S", "P"]);

// Display the selected columns as a readable table.
Demo.table(selectedResults, "Selected time course");`,
  },
  {
    id: "model-inspection",
    name: "Inspect model structure",
    source: `// Load a model so we can inspect its structure without simulating it.
const sim = await Iridium.createSimulator();
await sim.loadAntimony(\`
A + B -> C; rate * A * B
A = 4
B = 6
C = 0
rate = 0.1
\`);

// Show the model name, or a fallback string if it has no name.
Demo.text(\`Model: \${sim.model.getModelName() || "unnamed"}\`);

// List the different kinds of components that make up this model.
Demo.list(sim.model.getFloatingSpeciesIds(), "Floating species");
Demo.list(sim.model.getGlobalParameterIds(), "Global parameters");
Demo.list(sim.model.getReactionIds(), "Reactions");

// This final list contains the values that can be requested in a time course.
Demo.list(sim.model.getAllTimeCourseComponentIds(), "Time-course components");`,
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

// Get the names of all species whose values can change during the simulation.
const speciesIds = sim.model.getFloatingSpeciesIds();

for (const id of speciesIds) {
  // Read the starting value so the slider range fits this species.
  const initialValue = sim.getValue(id);
  const maxValue = Math.max(initialValue * 2, 1);

  // Define a slider named after the species and read its current value.
  const value = Demo.slider(0, maxValue, maxValue / 100, id);

  // Apply the slider value to the simulator before running it.
  sim.setValue(id, value);
}

// Plot the simulation after all slider values have been applied.
Demo.plot(sim.simulate(0, 20, 200), "Simulation with adjustable species");`,
  },
];
