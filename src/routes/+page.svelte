<script lang="ts">
  // if you need to turn something into a store
  // so that you can use it in multiple places.

  // With runes, reactivity extends beyond the boundaries of your .svelte files.
  // To encapsulate e.g. counter logic in a way that could be reused between components,
  // today, you would use a custom store in a .ts file.
  // We've found that the store API can get rather unwieldy when you start doing more complex things.
  // let count = $state(0);

  // const increment = () => {
  // 	count += 1;
  // };
  // const decrement = () => {
  // 	if (count === 0) return;
  // 	count -= 1;
  // };

  import { browser } from '$app/environment';
  // import System from 'svelte-system-info'
  import { Todos, getGlobalTodos } from '$utils/todos.svelte';
  import {
    quickSort,
    bubbleSort,
    insertionSort,
    selectionSort,
    pxStringLength,
  } from '$utils';
  // Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
  import {
    createCounter,
    getGlobalCounter,
  } from '../../src/lib/utils/counter.svelte';
  let { data } = $props();
  const counter = createCounter();

  const gCounter = getGlobalCounter();

  const family = {
    Isakovic: {
      parents: {
        father: 'Ljubomir',
        mother: 'Snezana',
      },
      children: ['Matia', 'Filip'],
    },
    Milutinovic: {
      parents: {
        father: 'Ljuban',
        mother: 'Tanja',
      },
      children: ['Mia', 'Marko'],
    },
    Kotur: {
      parents: {
        father: 'Zeljko',
        mother: 'Dragana',
      },
      children: ['Bojana', 'Nikola'],
    },
    Krsmanovic: {
      parents: {
        father: 'Sasa',
        mother: 'Mirjana',
      },
      children: ['Jovana', 'Milica'],
    },
  };

  // NOTE: testing sorts
  // let arr: number[] = [];
  // for (let i = 0; i < 10; i++) {
  //   arr.push(Math.floor(Math.random() * 1000000));
  // }
  // const sortedArr = quickSort(arr);
  // const sortedArr = bubbleSort(arr);
  // const sortedArr = insertionSort(arr);
  // const sortedArr = selectionSort(arr);
  // const arr = todos.asArray();
  // arr.forEach((member) => console.log(member));
</script>

<!-- <pre>{pxStringLength('First Name is required')}</pre> -->
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
{#snippet listFamily()}
  <div class="family-container">
    <ul>
      <div>
        {#each Object.entries(family) as [lastName, members]}
          <li class="last-name">{`The ${lastName}'s`}</li>
          <ul>
            <li>
              father: &nbsp; <span style="color:lightgreen"
                >{members['parents']['father']}</span
              >
            </li>
            <li>
              mother: <span style="color:lightgreen"
                >{members['parents']['mother']}</span
              >
            </li>
            <li class="children-title">children</li>
            <!-- <ul> -->
            <li class="children">
              {#each members['children'] as child, ix}
                {child}{#if ix < members['children'].length - 1},{/if}
              {/each}
            </li>
            <!-- </ul> -->
          </ul>
        {/each}
      </div>
    </ul>
  </div>
{/snippet}
<div class="wrapper">
  <div style="margin:0;padding:0;">
    <pre style="font-size:14px;">
    the Counter component is defined in /$utils/counter.svelte.ts.
		Its constructor function createCounter() is exposed and can be called 
		to deliver an instance of the counter, which is then in a local scope 
		like here in this /+page.svelte. 
		The counter will be destroyed by navigating out of page and on returning
		to the page a new local instance could be obtain by calling createCounter()

		On the other hand a $utils/getGlobalCounter() returns an instance of the counter
    created in $utils scope, so that the instance is out of this page and navigating 
    out of this page cannot destroy it, so it is in the global scope looking from this 
    page. Changing the count value by incrementing/decrementing using +/- button below
    will keep the count stable when navigating out of this page and returning back.
    Try changing the count, navigate out of and return back to see that count is preserved.

		In this app in the next, Counter page (click on Counter in navigation bar) where we use
		the same counter there, and as it is global -- both pages could change its count
		and navigating anywhere will preserve the count in this global counter.

    A snippet listFamily has direct access to locally defined family TS object

      const family = &lcub;
        Isakovic: &lcub;
          parents: &lcub;
            father: 'Ljubomir',
            mother: 'Snezana',
          &rcub;,
          children: ['Matia', 'Filip'],
        &rcub;,
        ...
      &rcub;

      It renders that family list turning the family TS object into iterable list via
      Object.entries(family) list

        &lcub;#each Object.entries(family) as [lastName, members]&rcub;
        
      styling &lt;ul&gt; and  &lt;li&gt; elements accordingly

      getWidth('First Name is required') is <span
        class="yellow"> {pxStringLength('First Name is required')}</span
      >
    </pre>
  </div>

  <div>
    <div class="local-counter">
      <button onclick={counter.increment}>
        clicks: {counter.count}
      </button>
      <button onclick={counter.decrement}>
        decrement <i class="fa-solid fa-gears" style="color:lightgreen"
        ></i></button
      >
    </div>
    <div class="global-counter">
      Global counter <span class="counter-line">{gCounter.count}</span>
      is equal across the pages<br />
      <button onclick={() => (gCounter.count += 1)}>+</button>
      <button onclick={() => (gCounter.count -= 1)}>-</button>
    </div>
    {@render listFamily()}
  </div>
  <!-- {@render listFamily()} -->
</div>

<!-- <div style="margin-bottom:1rem;">Sorted Array {sortedArr.slice(1, 30)}</div> -->

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
  .wrapper {
    margin: 3rem 2rem 0 3rem;
    /*background-color: #4e4e5e;
    color: white;
    padding: 0 0 1rem 3rem;
    border-radius: 1rem; */
    width: 60vw;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    // margin: 0;

    a {
      text-decoration: none;
      margin: 1rem 0 0 1rem;
      padding: 5px 1rem;
      border: 1px solid transparent;
      border-radius: 5px;
      color: white;
      background-color: #6e6e8e;
      &:hover {
        color: yellow;
        border-color: yellow;
      }
    }
  }
  .local-counter {
    @include container($head: 'Local Counter', $head-color: skyblue);
    margin: 0 0 0 3rem;
    width: 25rem;
  }
  .family-container {
    @include container($head: 'Our Family', $head-color: skyblue);
    margin: 2rem 0 0 3rem;
    width: 25rem;
  }
  .global-counter {
    @include container($head: 'Global Counter', $head-color: lightgreen);
    margin: 1rem 0 0 3rem;
    width: 25rem !important;
  }
  pre {
    padding: 0;
    margin: 0;
  }
  .counter-line {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 24px;
    color: yellow;
    font-family: helvetica;
  }
  ul {
    list-style: none;
    // padding: 0;
    margin: 0;
  }
  .children {
    display: inline-block;
    color: skyblue;
  }
  .children-title {
    color: yellow;
    opacity: 0.7;
    font-style: italic;
    margin-left: -1rem;
  }
  .last-name {
    font-size: 18px;
    font-style: italic;
    color: yellowgreen;
  }
</style>
