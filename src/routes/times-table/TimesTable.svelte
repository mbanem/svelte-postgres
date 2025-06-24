<script lang="ts">
  import { multiply } from './utils';
  let n = $state(2);
  interface IProps {
    count: number;
  }
  let { count = $bindable() }: IProps = $props();
  const incrementBoth = () => {
    n += 1;
    count += 1;
  };
  const decrementBoth = () => {
    n -= 1;
    count -= 1;
  };
</script>

<p>1 * {n} = {await multiply(1, n)}</p>
<p>2 * {n} = {await multiply(2, n)}</p>
<p>3 * {n} = {await multiply(3, n)}</p>
<p>4 * {n} = {await multiply(4, n)}</p>
<p>5 * {n} = {await multiply(5, n)}</p>

<button onclick={() => n++}>increment n</button>
<button onclick={() => n--}>decrement n</button>
{#each Array(5), m}
  {@const val = m + 1}
  <p>{val} * {n} = {await multiply(val, n)}</p>
{/each}
<button onclick={incrementBoth}>increment both parent and child</button>
<button onclick={decrementBoth}>decrement both parent and child</button>
