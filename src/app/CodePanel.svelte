<script lang="ts">
  import { basicSetup } from "codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
  import { Compartment, EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { tags } from "@lezer/highlight";
  import { onMount } from "svelte";
  import { code } from "./state.svelte";

  type Props = {
    theme: "dark" | "light";
  };

  let { theme }: Props = $props();
  let host: HTMLDivElement;
  let view: EditorView | undefined;
  const themeCompartment = new Compartment();
  const darkHighlighting = syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, color: "#77dce0" },
      { tag: tags.definition(tags.variableName), color: "#5adb8e" },
      { tag: tags.function(tags.variableName), color: "#5adb8e" },
      { tag: tags.typeName, color: "#77dce0" },
      { tag: tags.operator, color: "#84cbe3" },
      { tag: tags.meta, color: "#81bdeb" },
      { tag: tags.string, color: "#e3df8a" },
      { tag: tags.number, color: "#f7bd7e" },
      { tag: tags.comment, color: "#6b967c" },
      { tag: tags.invalid, color: "#ff0000" },
    ]),
  );
  const lightHighlighting = syntaxHighlighting(
    HighlightStyle.define([
      { tag: tags.keyword, color: "#007f83" },
      { tag: tags.definition(tags.variableName), color: "#187c4f" },
      { tag: tags.function(tags.variableName), color: "#187c4f" },
      { tag: tags.typeName, color: "#007f83" },
      { tag: tags.operator, color: "#168fba" },
      { tag: tags.meta, color: "#126fc0" },
      { tag: tags.string, color: "#776f00" },
      { tag: tags.number, color: "#b45c00" },
      { tag: tags.comment, color: "#587a65" },
      { tag: tags.invalid, color: "#ff0000" },
    ]),
  );

  function makeTheme(currentTheme: "dark" | "light") {
    const dark = currentTheme === "dark";
    return EditorView.theme(
      {
        "&.cm-editor": {
          height: "100%",
          color: dark ? "#e6e8eb" : "#111314",
          backgroundColor: dark ? "#191b1d" : "#fefefe",
          fontSize: "13px",
        },
        ".cm-scroller": {
          overflow: "auto",
          fontFamily: "var(--mono)",
          lineHeight: "1.75",
        },
        ".cm-content": {
          minHeight: "100%",
          padding: "0 22px",
          caretColor: dark ? "#d0d0d0" : "#555555",
        },
        ".cm-line": {
          padding: "0",
        },
        "&.cm-editor .cm-gutters": {
          border: "none",
          padding: "0 10px 0 12px",
          backgroundColor: dark ? "#191b1d" : "#fefefe",
          color: dark ? "#5e6673" : "#969da8",
        },
        ".cm-gutters .cm-activeLineGutter": {
          color: dark ? "#c1c8d4" : "#3c3f45",
          backgroundColor: "transparent",
        },
        ".cm-line.cm-activeLine": {
          backgroundColor: "transparent",
        },
        ".cm-selectionBackground": {
          backgroundColor: dark ? "#2c3b4d !important" : "#b9def5 !important",
        },
        "&.cm-focused .cm-selectionBackground": {
          backgroundColor: dark ? "#2c3b4d !important" : "#b9def5 !important",
        },
        ".cm-cursor": {
          borderLeftColor: dark ? "#d0d0d0" : "#555555",
        },
        ".cm-tooltip": {
          border: "1px solid var(--border)",
          backgroundColor: dark ? "#191b1d" : "#fefefe",
          color: dark ? "#e6e8eb" : "#111314",
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
            theme === "dark" ? darkHighlighting : lightHighlighting,
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
    const currentCode = code.value;
    if (view && view.state.doc.toString() !== currentCode) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: currentCode },
      });
    }
  });

  $effect(() => {
    const currentTheme = theme;
    const dark = currentTheme === "dark";
    view?.dispatch({
      effects: themeCompartment.reconfigure([
        dark ? darkHighlighting : lightHighlighting,
        makeTheme(currentTheme),
      ]),
    });
  });
</script>

<div class="h-0 min-h-0 w-full flex-1 overflow-hidden" bind:this={host}></div>
