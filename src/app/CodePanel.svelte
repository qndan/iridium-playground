<script lang="ts">
  import { basicSetup } from "codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { Compartment, EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { onMount } from "svelte";
  import { code } from "./state.svelte";

  type Props = {
    theme: "dark" | "light";
  };

  let { theme }: Props = $props();
  let host: HTMLDivElement;
  let view: EditorView | undefined;
  const themeCompartment = new Compartment();

  function makeTheme(currentTheme: "dark" | "light") {
    const dark = currentTheme === "dark";
    return EditorView.theme(
      {
        "&": {
          height: "100%",
          color: "var(--text-primary)",
          backgroundColor: "var(--surface-soft)",
          fontSize: "13px",
        },
        ".cm-scroller": {
          overflow: "auto",
          fontFamily: "var(--mono)",
          lineHeight: "1.75",
        },
        ".cm-content": {
          minHeight: "100%",
          padding: "20px 22px",
          caretColor: dark ? "#b6bdff" : "#545fc1",
        },
        ".cm-line": {
          padding: "0",
        },
        ".cm-gutters": {
          border: "none",
          backgroundColor: "var(--surface-soft)",
          color: "var(--subtle)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "var(--surface)",
        },
        ".cm-activeLine": {
          backgroundColor: dark ? "rgba(255, 255, 255, .035)" : "rgba(32, 39, 56, .045)",
        },
        ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
          backgroundColor: dark ? "rgba(139, 149, 255, .28)" : "rgba(84, 95, 193, .2)",
        },
        ".cm-cursor": {
          borderLeftColor: dark ? "#b6bdff" : "#545fc1",
        },
        ".cm-tooltip": {
          border: "1px solid var(--border)",
          backgroundColor: "var(--surface-raised)",
          color: "var(--text-primary)",
        },
        ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
          backgroundColor: "var(--chip-bg)",
          color: "var(--chip-text)",
        },
      },
      { dark },
    );
  }

  onMount(() => {
    view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: code.value,
        extensions: [
          basicSetup,
          javascript(),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            "aria-label": "JavaScript source code",
            autocapitalize: "off",
            autocomplete: "off",
            spellcheck: "false",
          }),
          themeCompartment.of([
            ...(theme === "dark" ? [oneDark] : []),
            makeTheme(theme),
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) code.value = update.state.doc.toString();
          }),
        ],
      }),
    });

    return () => {
      view?.destroy();
      view = undefined;
    };
  });

  $effect(() => {
    const currentTheme = theme;
    const dark = currentTheme === "dark";
    view?.dispatch({
      effects: themeCompartment.reconfigure([
        ...(dark ? [oneDark] : []),
        makeTheme(currentTheme),
      ]),
    });
  });
</script>

<div class="editor-host" bind:this={host}></div>

<style>
  .editor-host {
    width: 100%;
    height: 0;
    min-height: 0;
    flex: 1 1 0;
    overflow: hidden;
  }
</style>
