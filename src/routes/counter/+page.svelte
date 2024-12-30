<script lang="ts">
  import { onMount } from 'svelte';
  import { Tooltip } from 'flowbite-svelte';
  import { createCounter, getGlobalCounter } from '$lib/utils/counter.svelte';
  import Area from '$components/Area.svelte';
  const counter = createCounter();

  // Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
  const gCounter = getGlobalCounter();

  // Area props
  let width = $state(12);
  let height = $state(13);
  let pHeight = $state(10);

  let raw = $state.raw([]);
  let appended = $state<number[]>([]);

  const appendToFrozen = () => {
    const num = Math.round(Math.random() * 100);
    appended.push(num);
    setTimeout(() => {
      // @ts-expect-error
      raw = [...raw, num];
    }, 0);
  };
  const removeFromToFrozen = () => {
    setTimeout(() => {
      raw = raw.filter((_: number, ix: number) => ix < raw.length - 1);
    });
    appended.pop();
  };
  onMount(() => {
    const el = document.querySelector('#w') as HTMLInputElement;
    if (el) {
      el.focus();
    }
    // @ts-expect-error
    [...5].forEach((n) => appendToFrozen());
  });
</script>

<svelte:head>
  <title>Counter</title>
</svelte:head>

<div class="wrapper">
  <pre>
	Counter component is defined in $lib-utils.counter.svelte.ts
	and can be used across the app, here in /counter/+page.svelte
		<button onclick={counter.increment}>clicks: {counter.count}</button> <button
      onclick={counter.decrement}> decrement </button>
  <div class="global-container">
    Global counter <span>{gCounter.count}</span> is equal across the pages
		<button onclick={() => (gCounter.count += 1)}>+</button> <button
        onclick={() => (gCounter.count -= 1)}>-</button
      >
  </div>
	</pre>
  <pre>
	We define <span style="color:yellow;">raw</span
    > = $state.raw([100, 101, 102]) that could only be reassigned/replaced
	completely, say this way: raw = [...raw, new+item]
	We can use reduce on raw like
		&lcub;raw.reduce((a, b) =&gt; a + b, 0)&rcub; which should give 303=100+101+103

	For instance &lcub;(raw = [300, 400, 500]).reduce((a, b) =&gt; a + b, 0)&rcub;
	raw [<span class="highlighted-array">{appended.join(', ')}</span>]
	gives total 	<span class="expression-highlighted"
      >{raw.reduce((a, b) => a + b, 0)}</span
    >
	<button data-append onclick={appendToFrozen}>append to raw</button> <button
      data-prepend
      onclick={removeFromToFrozen}>remove last from raw</button
    >
  </pre>
</div>

<Area {width} {height} {pHeight} />
<div class="horizontal-block">
  <div class="dimensions">
    <label for="w"> rectangle width </label>
    <input id="w" class="number" type="number" bind:value={width} />
    <label for="h"> rectangle height </label>
    <input id="h" class="number" type="number" bind:value={height} />
    <label for="z"> parallelepiped height </label>
    <input id="z" class="number" type="number" bind:value={pHeight} />
  </div>
  <div>
    <pre>
        const volumeStore = () =&gt; &lcub;
        let volume = $state(0)
        return &lcub;
        get volume() &lcub;
        return volume
        &rcub;,
        set volume(val: number) &lcub;
        volume = val
        &rcub;
        &rcub;
        &rcub;
        
        export const globalVolume = volumeStore()
    </pre>
  </div>
  <div>
    <pre>
        The volumeStore is a closure holding volume as a local $store variable.
        Upon call it returns an object with volume getter and setter.
        The width,height and pHeight are $props send by parent component,
        the area is set via $derived(width * height) and the volume closure is set
        via $effect(() =&gt; &lcub; globalVolume.volume = area * pHeight; &rcub;);
        It is imported here and an $effect sets globalVolume.volume = area * pHeight;
		</pre>
  </div>
</div>

<style lang="scss">
  .wrapper {
    background-color: #4e4e5e;
    color: white;
    border-radius: 1rem;
    width: 90vw;
    height: 30vh;
    margin: 0 auto;
    border: none;
    // a {
    //   text-decoration: none;
    //   margin: 1rem 0 0 1rem;
    //   padding: 5px 1rem;
    //   border: 1px solid transparent;
    //   border-radius: 5px;
    //   color: white;
    //   background-color: #6e6e8e;
    //   &:hover {
    //     color: yellow;
    //     border-color: yellow;
    //   }
    // }
  }
  button {
    display: inline-block;
  }
  .dimensions {
    display: grid;
    width: 13.5rem;
    grid-template-columns: 10rem 3rem;
    grid-template-rows: 2rem 2rem;
    margin: 2rem 0 0 2rem;
  }
  .highlighted-array {
    font-size: 20px;
    color: pink;
  }
  [data-append],
  [data-prepend] {
    width: 12rem;
  }
  .horizontal-block {
    display: grid;
    grid-template-columns: 15rem 23rem 30rem;
    width: 90vw;
    margin-left: 6rem;
    background-color: #4e4e5e;
    border-radius: 12px;
  }
  .global-container {
    @include container($head: 'Global Container', $head-color: lightgreen);
    margin: 0;
    padding: 0 2rem 0 0;
    span {
      font-size: 24px;
      color: yellow;
    }
  }
</style>
