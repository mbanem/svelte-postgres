<script lang="ts">
  import { delayed } from './utils';
  import TimesTable from './TimesTable.svelte';
  let count = $state(1);
</script>

<a href="./search-city">Search City</a><br />
<svelte:boundary>
  <div class="two-column">
    <div class="count">
      <p>latency 1.5 sec</p>
      <button onclick={() => (count += 1)}>increment count</button>
      <p style="color:blue;font-weight:600;">
        count {count} * 2 = {await delayed(count * 2)}
      </p>
    </div>
    <div class="count">
      <TimesTable bind:count></TimesTable>
    </div>
  </div>
  {#snippet pending()}
    <p>loading...</p>
  {/snippet}
</svelte:boundary>

<style>
  .two-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 50vw;
    margin: 4rem auto;
  }
  .count {
    display: inline-block;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 1rem 2rem;
    p {
      padding: 0.6rem 0;
      margin: 0;
    }
  }
</style>
