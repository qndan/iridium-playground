export const code = $state({
  value: `// Iridium and Demo are automatically available in this editor.
const simulator = await Iridium.createSimulator();

await simulator.loadAntimony(\`
A -> B; k1 * A
B -> C; k2 * B
A = 10
B = 0
C = 0
k1 = 0.25
k2 = 0.5
\`);

Demo.list(simulator.getIds(), "Model ids");
Demo.plot(simulator.simulate(0, 20, 200), "A simple reaction");

const modifiedK1 = Demo.slider(0, 2, 0.05, "k1 (modified state)");
simulator.reset();
simulator.setValue("k1", modifiedK1);

Demo.plot(simulator.simulate(0, 20, 200), "With modified state");`,
});
