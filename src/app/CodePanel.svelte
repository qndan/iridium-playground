<script lang="ts">
  import { code } from "./state.svelte";
</script>

<label class="editor-label" for="code-editor">JavaScript source</label>
<textarea
  id="code-editor"
  class="code-editor"
  bind:value={code.value}
  autocapitalize="off"
  autocomplete="off"
  spellcheck="false"
  aria-label="JavaScript source code"
></textarea>

<style>
  .editor-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .code-editor {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 24px;
    resize: none;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font: 13px/1.75 var(--mono);
    tab-size: 2;
  }

  .code-editor::selection {
    background: rgb(71 111 255 / 24%);
  }
</style>
