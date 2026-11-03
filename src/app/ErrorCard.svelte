<script lang="ts">
  type Props = {
    message: string;
  };

  let { message }: Props = $props();
</script>

<div class="shrink-0 overflow-hidden rounded-panel border border-error-border bg-error-bg" role="alert">
  <div class="flex min-h-10 items-center gap-2 border-b border-error-heading-border px-3 text-11 font-semibold text-error-heading-text">
    <span class="grid size-4 place-items-center rounded-full bg-error-icon-bg font-mono text-2xs text-error-icon-text" aria-hidden="true">!</span>
    Execution error
  </div>
  <pre class="m-0 whitespace-pre-wrap wrap-anywhere p-3 font-mono text-11 leading-relaxed text-error-text">{message}</pre>
</div>
