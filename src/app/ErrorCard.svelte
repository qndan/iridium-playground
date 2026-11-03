<script lang="ts">
  type Props = {
    message: string;
  };

  let { message }: Props = $props();
</script>

<div class="error-card" role="alert">
  <div class="error-title"><span aria-hidden="true">!</span> Execution error</div>
  <pre>{message}</pre>
</div>

<style>
  .error-card {
    flex: 0 0 auto;
    overflow: hidden;
    border: 1px solid var(--error-border);
    border-radius: var(--border-radius);
    background: var(--error-bg);
  }

  .error-title {
    display: flex;
    min-height: 40px;
    align-items: center;
    gap: 8px;
    padding: 0 13px;
    border-bottom: 1px solid var(--error-heading-border);
    color: var(--error-heading-text);
    font-size: 11px;
    font-weight: 600;
  }

  .error-title span {
    display: grid;
    width: 16px;
    height: 16px;
    place-items: center;
    border-radius: 50%;
    background: var(--error-icon-bg);
    color: var(--error-icon-text);
    font-family: var(--mono);
    font-size: 10px;
  }

  pre {
    margin: 0;
    padding: 13px;
    color: var(--error-text);
    font-family: var(--mono);
    font-size: 11px;
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
