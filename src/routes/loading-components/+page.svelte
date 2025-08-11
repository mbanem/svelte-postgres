<script>
  let module = $state('');
  let A = true;
  async function loadComponent() {
    if (A) {
      module = await import('./ComponentA.svelte');
    } else {
      module = await import('./ComponentB.svelte');
    }
    A = !A;
  }
  loadComponent();

  let range = $state(100);
  const range_ = () => {
    return range;
  };
  // NOTE: reactive variable range change cannot be detected
  // inside $derived as it is in the same scope.
  // To change the scope we return the range from a function
  // which defines an another scope
  let columnCount = $derived(range_() >= 1000 ? 20 : range >= 500 ? 15 : 10);
  let cellWidth = $derived(
    range_() >= 100000
      ? 3
      : range > 10000
        ? 2.4
        : range >= 1000
          ? 2
          : range >= 500
            ? 1.5
            : 1.2,
  );
  const isPrime = (n) => {
    if (n === 1) return true;
    const max = n ** 0.5;
    for (let i = 2; i <= max; i++) {
      if (n % i === 0) return false;
    }
    return true;
  };
</script>

<div class="wrapper">
  {#if module}
    <module.default />
  {/if}
  <br />
  <button onclick={loadComponent}>alternate greeting component</button>
</div>
<pre>
  The app defines let module = $state('');
  and in an async function alternatively loads ComponentA.svelte
  or ComponentB.svelte when 'alternate greeting' is selected.
  The function issue
    module = await import('./ComponentA|B.svelte');
  and, when module reactive variable in not empty string, it
  displays the greeting component A or B as
    &lcub;#if module&rcub;
      &lt;module.default /&gt;
    &lcub;/if&rcub;
</pre>
<div class="wrapper">
  Prime numbers up to &nbsp;<input
    type="number"
    bind:value={range}
    placeholder="Up to what number to test primes"
  />

  {#key columnCount}
    <div
      class="grid-wrapper"
      style="grid-template-columns: repeat({columnCount}, {cellWidth}rem);"
    >
      {#each Array(range), n}
        {#if isPrime(n + 1)}
          <p>{n + 1}</p>
        {/if}
      {/each}
    </div>
  {/key}
</div>

<style lang="scss">
  .wrapper {
    margin: 0 0 0 10rem;
    &:last-child {
      width: max-content;
      margin-left: 9rem;
      padding: 1rem;
      border: 1px solid gray;
      border-radius: 5px;
      overflow-y: auto;
    }
  }
  pre {
    margin: 0 0 0 8rem;
  }
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(10, 1rem);
    grid-auto-rows: 1.5rem;
    gap: 3px;
  }
  [type='number'] {
    width: 4rem;
  }
  button {
    margin: 0;
  }
</style>
