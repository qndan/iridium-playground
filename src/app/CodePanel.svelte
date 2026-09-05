<script>
import { code } from "./state.svelte.ts";
</script>

<div class="container">
  <textarea class="code" bind:value={code.value} />
</div>

<style>
.container {
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.code {
  resize: none;
  font-family: var(--mono);
  font-size: var(--font-size-md);
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  color: var(--text);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
</style>
