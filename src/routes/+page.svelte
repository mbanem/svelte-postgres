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

  import { Todos, getGlobalTodos } from '$lib/utils/todos.svelte';
  // Outside .svelte components, runes can only be used in .svelte.js and .svelte.ts modules.
  import { createCounter, getGlobalCounter } from '$lib/utils/counter.svelte';
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

  // const arr = todos.asArray();
  // arr.forEach((member) => console.log(member));
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
{#snippet listFamily()}
  <div class="family-container">
    <ul>
      <div>
        {#each Object.entries(family) as [lastName, members]}
          <li class="last-name">{`The ${lastName}'s`}</li>
          <ul>
            <li>parents</li>
            <ul>
              <li>
                father: {members['parents']['father']}
              </li>
              <li>
                mother: {members['parents']['mother']}
              </li>
            </ul>
            <li>children</li>
            <ul>
              {#each members['children'] as child}
                <li>{child}</li>
              {/each}
            </ul>
          </ul>
        {/each}
      </div>
    </ul>
  </div>
{/snippet}
<div class="wrapper">
  <div>
    <pre>
    the Counter component is defined in /$lib-utils/counter.svelte.ts.
		Its constructor function createCounter() is exposed and can be called 
		to deliver an instance of the counter, which is then in a local scope 
		like here in this /+page.svelte. 
		The counter will be destroyed by navigating out of page and on returning
		to the page a new local instance could be obtain by calling createCounter()

		On the other hand a getGlobalCounter() is exposed from the same $lib-utils
		but it return an instance of the counter created in $lib-utils, so that
		instance is out of this page and navigating out of this page cannot destroyed
		it, so it is in global scope looking from this page. Changing the count value
		but incrementing/decrementing using +/- button below will keep the count
		stable when navigating out of this page and returning back. Try changing the
		count, navigate out of and return back to see that count is preserved.

		In this app in the Counter page (click on Counter in navigation bar) we use
		the same counter there, and as it is global both pages could change its count
		and navigating anywhere will preserve the count in this global counter.
    </pre>
  </div>

  <div>
    <div class="local-counter">
      <button onclick={counter.increment}>
        clicks: {counter.count}
      </button>
      <button onclick={counter.decrement}> decrement </button>
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

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
  .wrapper {
    margin: 4rem 2rem 0 3rem;
    /*background-color: #4e4e5e;
    color: white;
    padding: 0 0 1rem 3rem;
    border-radius: 1rem; */
    width: 80vw;
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
    margin: 1rem 0 0 3rem;
    width: 25rem;
  }
  .global-counter {
    @include container($head: 'Global Counter', $head-color: lightgreen);
    margin: 2rem 0 0 3rem;
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
  .last-name {
    font-size: 20px;
    font-style: italic;
    color: yellowgreen;
  }
</style>
