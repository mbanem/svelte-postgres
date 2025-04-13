<script lang="ts">
  type Func = () => void;
  type Car = {
    make: string;
    year: number;
    mileage: number;
    price: number;
  };
  let cadillac: Car = {
    make: 'Cadillac',
    year: 2009,
    mileage: 102000,
    price: 40000.0,
  };
  // this part is getting access to Child <script module lang='ts'> exported functions
  import Child, { childCounter, getChildCount } from './Child.svelte';

  let count = 4;
  let pCounter: () => number;
  const parentCounter = (delta: number) => {
    count += delta;
  };
  const getParentCount = () => {
    return count;
  };
</script>

<svelte:head>
  <title>Parent calls child</title>
</svelte:head>
<div class="grid-wrapper">
  <div>
    <p class="info">
      Child values are in <span class="lightgreen">lightgreen</span>
    </p>
    <p class="info">
      Parent values are in <span class="lightgreen">yellow</span>
    </p>

    <div class="parent-estate">
      <p>getChildCount() <span class="lightgreen">{getChildCount()}</span></p>
      <button onclick={() => childCounter(4)}>
        increment child count by 4
      </button>
      <button onclick={() => childCounter(-4)}>
        decrement child count by 4
      </button>
      <p>variable count <span class="yellow">{count}</span></p>
    </div>

    <!-- bind:car allows parent to have access to car and change its properties
  and as it ios new reactive it will be visible at both sides child and parent
  without bind:car parent cannot change this variable
-->
    <Child {parentCounter} {getParentCount} bind:car={cadillac}></Child>

    <div class="car-container">
      <p></p>
      <p class="list-header">Car Details at Parent</p>
      <p>Make</p>
      <input type="text" bind:value={cadillac.make} />
      <p>Year</p>
      <input type="text" bind:value={cadillac.year} />
      <p>Mileage</p>
      <input type="text" bind:value={cadillac.mileage} />
      <p>Price</p>
      <input type="text" bind:value={cadillac.price} />
    </div>
  </div>
  <div>
    <pre>
  Child defines and exports childCounter and getChildCount from its module 
  <code>      &lt;script module lang='ts'&gt;
        let count = $state(0)
        export const childCounter = (delta: number) =&gt; &lcub; count += delta &rcub;
        export const getChildCount = () =&gt; &lcub;
          return count
        &rcub;
      &lt;/script&gt;
  </code>
  and Parent imports child component and its exported functions as
      <code
        >imports Child, &lcub;childCounter, getChildCount&rcub; from './Child.svelte'</code
      >
  and uses them
<code>    Parent defines an object 
    let cadillac: Car = &lcub;
      make: 'Cadillac',
      year: 2009,
      mileage: 102000,
      price: 40000.0
    &rcub;</code
      >
  and export is to child but requires two way communication on changing object properties
  by issuing bind:car
    <code
        >&lt;Child &lcub;parentCounter&rcub; &lcub;getParentCount&rcub; bind:car=&lcub;cadillac&rcub;&gt;&lt;/Child&gt;</code
      >
  Child creates regular script section and gets all prompts from parent as
  <code>    &lt;script lang="ts"&gt;
      type Car = &lcub;
        make: string
        year: number
        mileage: number
        price: number
      &rcub;
      type PROPS = &lcub;
        parentCounter: (_: number) =&gt; void
        getParentCount: () =&gt; number
        car: Car
      &rcub;
      let &lcub; parentCounter, getParentCount, car = $bindable() &rcub;: PROPS = $props()
    &lt;/script&gt;</code
      >
  On both sides child and parent input box values are bound to car.PROPERTIES so two way 
  communication ensures update at any side is propagated to the other side
  Values in Child are in lightgreen and in parent in yellow
</pre>
  </div>
</div>

<style lang="scss">
  .grid-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 90vw;
    margin-left: 5%;
  }
  .list-header {
    grid-column: 1/3;
    border-bottom: 1px solid gray;
    color: lightgreen;
    margin-bottom: 10px;
    font-size: 18px;
  }
  pre {
    // position: absolute;
    // top: 3rem;
    // left: 40vw;
    tab-size: 2;
    font-size: 14px;
    color: skyblue;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 0;
    margin: 0;
    // padding: 1rem 1rem 3rem 1rem;
  }
  code {
    display: inline-block;
    color: lightgreen;
    padding: 0;
    margin: 0;
  }
  p,
  input {
    padding: 0;
    margin: 0;
    color: yellow;
  }
  .car-container {
    display: grid;
    width: max-content;
    grid-template-columns: 4rem 10rem;
    grid-auto-rows: 1.4rem;
    align-items: baseline;
    border: 1px solid gray;
    border-radius: 8px;
    font-size: 14px;
    padding: 0 2rem;
    margin: 6px 0 0 4rem;
  }
  input {
    width: 6rem !important;
    color: yellow !important;
    border: none;
    outline: none;
    font-size: 14px;
  }
  .parent-estate {
    position: relative;
    margin-top: 1rem;
    width: max-content;
    // padding: 6px 2rem;
    border: var(--BLOCK-BORDER);
    border-radius: var(--BLOCK-BORDER-RADIUS);
    @include container(
      $head: 'Parent Estate',
      $head-color: skyblue,
      $padding: 10px 1rem
    );
  }
  .lightgreen {
    color: lightgreen;
    font-size: 1.3rem;
  }
  .lightgreen {
    color: lightgreen;
  }
  .info {
    margin: 0 0 0 4rem;
    font-size: 14px;
  }
</style>
