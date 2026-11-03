<div class="empty-state">
  <div class="empty-icon" aria-hidden="true">↗</div>
  <h3>Your results will appear here</h3>
  <p>Call <code>Demo.plot()</code>, <code>Demo.table()</code>, <code>Demo.text()</code>, <code>Demo.list()</code>, or <code>Demo.slider()</code> in your code.</p>
</div>

<style>
  .empty-state {
    display: flex;
    min-height: 240px;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    text-align: center;
  }

  .empty-icon {
    display: grid;
    width: 44px;
    height: 44px;
    margin-bottom: 16px;
    place-items: center;
    border: 1px solid var(--empty-border);
    border-radius: var(--border-radius);
    background: var(--empty-bg);
    color: var(--text-secondary);
    font-size: 21px;
  }

  h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
  }

  p {
    max-width: 270px;
    margin: 8px 0 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.7;
  }

  .empty-state code {
    color: var(--chip-text);
    font-family: var(--mono);
    font-size: 10px;
  }

</style>
