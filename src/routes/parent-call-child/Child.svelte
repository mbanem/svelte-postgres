<script module lang="ts">
  // in order to export functions from component it has to be from a module
  // so we define all exports in a module
  let count = $state(0);
  export const childCounter = (delta: number) => {
    count += delta;
  };
  export const getChildCount = () => {
    return count;
  };
</script>

<script lang="ts">
  export const func = () => {
    console.log('func called');
  };
  type Car = {
    make: string;
    year: number;
    mileage: number;
    price: number;
  };
  type PROPS = {
    parentCounter: (_: number) => void;
    getParentCount: () => number;
    car: Car;
  };
  let { parentCounter, getParentCount, car = $bindable() }: PROPS = $props();
</script>

<div class="child-estate">
  <p>local count variable <span class="lightgreen">{count}</span></p>
  <p>locally getChildCount() <span class="lightgreen">{count}</span></p>
</div>

<div class="child-parent-estate">
  <p>getParentCount() <span class="yellow">{getParentCount()}</span></p>
  <button onclick={() => parentCounter(7)}>call parentCounter(7)</button>
  <button onclick={() => parentCounter(-7)}>call parentCounter(-7)</button>
</div>
<p>All car properties are bound to input box values and so</p>
<p>updating any and anywhere is visible at bot sides child and parent</p>
<div class="car-container">
  <p></p>
  <p class="list-header">Car Details at Child</p>
  <p>Make</p>
  <input type="text" bind:value={car.make} />
  <p>Year</p>
  <input type="text" bind:value={car.year} />
  <p>Mileage</p>
  <input type="text" bind:value={car.mileage} />
  <p>Price</p>
  <input type="text" bind:value={car.price} />
</div>

<style lang="scss">
  p,
  input {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    color: lightgreen;
  }
  .car-container {
    display: grid;
    width: max-content;
    grid-template-columns: 4rem 10rem;
    grid-auto-rows: 1.4rem;
    align-items: baseline;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 0 2rem;
    margin: 1rem 0 0 4rem;
    font-size: 14px;
  }
  .list-header {
    grid-column: 1/3;
    border-bottom: 1px solid gray;
    color: yellow;
    font-size: 18px;
  }
  input {
    width: 6rem !important;
    color: lightgreen !important;
    font-size: 14px;
  }
  .child-estate,
  .child-parent-estate {
    position: relative;
    margin: 1rem 0 0 0;
    width: max-content;
    padding: 6px 2rem;
    border: var(--BLOCK-BORDER);
    border-radius: var(--BLOCK-BORDER-RADIUS);
    @include container(
      $head: 'Child Estate',
      $head-color: skyblue,
      $padding: 10px 1rem
    );
  }
  .child-parent-estate {
    @include container(
      $head: 'Child Estate Using Parent',
      $head-color: skyblue,
      $padding: 10px 1rem
    );
  }
  .lightgreen {
    font-size: 1.3rem;
    color: lightgreen;
  }
  .yellow {
    font-size: 1.3rem;
    color: yellow;
  }
</style>
