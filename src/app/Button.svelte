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
  class={`button ${variant}`}
  {disabled}
  {onclick}
  aria-label={ariaLabel}
  {title}
>
  {@render children()}
</button>

<style>
  .button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
  }

  .button:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--surface-raised) 96%, var(--text-primary) 4%);
    border-color: color-mix(in srgb, var(--border) 92%, var(--text-primary) 8%);
    color: var(--text-primary);
  }

  .button:focus-visible {
    outline: 2px solid var(--text-secondary);
    outline-offset: 2px;
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .button.primary {
    min-height: 30px;
    gap: 7px;
    padding: 0 11px;
    border-color: var(--tag-border);
    background: var(--surface-raised);
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 500;
  }

  .button.secondary {
    min-height: 25px;
    padding: 0 8px;
    border-color: var(--result-border);
    background: var(--surface-soft);
    font-size: 10px;
  }

  .button.icon {
    width: 28px;
    height: 28px;
    padding: 0;
  }

</style>
