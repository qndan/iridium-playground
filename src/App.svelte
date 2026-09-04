<script>
import TopBar from "./lib/TopBar.svelte";
import CodePanel from "./lib/CodePanel.svelte";
import PlotPanel from "./lib/PlotPanel.svelte";
import OptionsPanel from "./lib/OptionsPanel.svelte";
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
