<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    variant: "primary" | "secondary" | "icon";
    ariaLabel: string;
    title?: string;
    disabled?: boolean;
    onclick: (event: MouseEvent) => void | Promise<void>;
  };

  let {
    children,
    variant,
    ariaLabel,
    title,
    disabled = false,
    onclick,
  }: Props = $props();
</script>

<button
  type="button"
  class={`inline-flex shrink-0 items-center justify-center rounded-panel border border-border bg-surface text-secondary transition-colors duration-150 ease-out hover:border-button-border-hover hover:bg-button-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-55 ${
    variant === "primary"
      ? "min-h-7.5 gap-1.75 border-tag-border bg-surface-raised px-2.75 text-11 font-medium text-primary"
      : variant === "secondary"
        ? "min-h-6.25 border-result-border bg-surface-soft px-2 text-2xs"
        : "size-7 p-0"
  }`}
  {disabled}
  {onclick}
  aria-label={ariaLabel}
  {title}
>
  {@render children()}
</button>
