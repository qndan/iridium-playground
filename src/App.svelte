<script lang="ts">
import TopBar from "./app/TopBar.svelte";
import CodePanel from "./app/CodePanel.svelte";
import PlotPanel from "./app/PlotPanel.svelte";
import OptionsPanel from "./app/OptionsPanel.svelte";
import { code, variables, columns, type Variable } from "./app/state.svelte.ts";
import { Simulator } from "./lib/Simulator";
import { TIME_NAME, TimeCourseOutput } from "antimony-language";

const simulator = new Simulator();

let antimonyModel;
let runtimeModel;

function getVariables(model, runtimeModel) {
  const variables: Variable[] = [];

  variables.push({
    type: "normal",
    name: TIME_NAME,
    visible: false,
  });

  for (const runtimeVariable of [...runtimeModel.y, ...runtimeModel.p]) {
    const object = model.objects.get(runtimeVariable.name)!;
    console.log(object);
    if (object.kind === "variable") {
      if (object?.assignment?.kind !== "rule") {
        variables.push({
          type: "settable",
          name: object.name,
          visible: object.variableKind !== "parameter" || object?.assignment?.kind === "rate",
          default: runtimeVariable.initialValue,
          value: runtimeVariable.initialValue,
        });
      } else {
        variables.push({
          type: "normal",
          name: object.name,
          visible: object.variableKind !== "parameter" || object?.assignment?.kind === "rate",
        });
      }
    }
  }

  for (const reactionName of runtimeModel.reactions) {
    variables.push({
      type: "normal",
      name: reactionName,
      visible: false,
    });
  }

  return variables;
}

$effect(() => {
  const abortController = new AbortController();

  async function run() {
    const got = await simulator.load(code.value, abortController.signal);
    antimonyModel = got.antimonyModel;
    runtimeModel = got.runtimeModel;
    variables.value = getVariables(antimonyModel, runtimeModel);
  }

  run();

  return () => abortController.abort();
});

$effect(() => {
  const sliderVariables = variables.value.reduce((acc, variable) => {
    if (variable.type === "settable") {
      acc[variable.name] = variable.value;
    }
    return acc;
  }, {});

  const abortController = new AbortController();

  async function run() {
    if (!runtimeModel || !antimonyModel) return;

    const buffer = await simulator.simulate(
      code.value,
      sliderVariables,
      abortController.signal,
    );

    const gotColumns = [];

    const output = new TimeCourseOutput(runtimeModel, buffer);

    const titles = [
      TIME_NAME,
      ...runtimeModel.y.map((v) => v.name),
      ...runtimeModel.p.map((v) => v.name),
      ...runtimeModel.reactions,
    ];

    for (const title of titles) {
      gotColumns.push({
        title,
        values: output.sliceColumn(title),
      });
    }

    columns.value = gotColumns;
  }

  run();

  return () => abortController.abort();
});
</script>

<div class="main">
  <div class="topBar">
    <TopBar />
  </div>
  <div class="content">
    <div class="code">
      <CodePanel />
    </div>
    <div class="plot">
      <PlotPanel />
    </div>
    <div class="options">
      <OptionsPanel />
    </div>
  </div>
</div>

<style>
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: var(--spacing-sm);
}

.topBar {
  margin-bottom: var(--spacing-sm);
}

.content {
  display: grid;
  grid-template-areas:
    "code    plot"
    "code options";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: var(--spacing-sm);
  flex-grow: 1;
}

.code {
  grid-area: code;
}

.plot {
  grid-area: plot;
}

.options {
  grid-area: options;
}
</style>
