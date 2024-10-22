<script lang="ts">
	import { asClassComponent } from 'svelte/legacy'
	type Car = {
		make: string
		year: number
		maillage: number
		price: number
	}
	let cadillac: Car = {
		make: 'Cadillac',
		year: 2009,
		maillage: 102000,
		price: 40000.0
	}
	// this part is getting access to Child <script module lang='ts'> exported functions
	import Child, { childCounter, getChildCount } from './Child.svelte'

	let count = 4
	let pCounter: () => number
	const parentCounter = (delta: number) => {
		count += delta
	}
	const getParentCount = () => {
		return count
	}
</script>

<p class="info">Child values are in <span class="lightgreen">lightgreen</span></p>
<p class="info">Parent values are in <span class="yellow">yellow</span></p>

<div class="parent-estate">
	<p>getChildCount() <span class="lightgreen">{getChildCount()}</span></p>
	<button onclick={() => childCounter(4)}> increment child count by 4 </button>
	<button onclick={() => childCounter(-4)}> decrement child count by 4 </button>
	<p>variable count <span class="yellow">{count}</span></p>
</div>

<!-- bind:car allows parent to have access to car and change its properties
  and as it ios new reactive it will be visible at both sides child and parent
  without bind:car parent cannot change this variable
-->
<Child {parentCounter} {getParentCount} bind:car={cadillac}></Child>

<div class="car-container">
	<p></p>
	<p>Car Detailes at Parent</p>
	<p>Make</p>
	<input type="text" bind:value={cadillac.make} />
	<p>Year</p>
	<input type="text" bind:value={cadillac.year} />
	<p>Maillage</p>
	<input type="text" bind:value={cadillac.maillage} />
	<p>Price</p>
	<input type="text" bind:value={cadillac.price} />
</div>

<pre>
  
  Child defines and exports from its module 
      &lt;script module lang='ts'&gt;
        let count = $state(0)
	export const childCounter = (delta: number) =&gt; &lcub; count += delta &rcub;
	export const getChildCount = () =&gt; &lcub;
		return count
	&rcub;
  &lt;/script&gt;
  and Parent imports child component and exported functions as
      imports Child, &lcub;childCounter, getChildCount&rcub; from './Child.svelte'
  and uses them 

  Parent defines an object 
        let cadillac: Car = &lcub;
          make: 'Cadillac',
          year: 2009,
          maillage: 102000,
          price: 40000.0
        &rcub;
  and export is to child but requires two way communication on changing object properties
  by issuing bind:car
    &lt;Child &lcub;parentCounter&rcub; &lcub;getParentCount&rcub; bind:car=&lcub;cadillac&rcub;&gt;&lt;/Child&gt;
  
  Child creates regular script section and gets all prompts from parent as
    &lt;script lang="ts"&gt;
      type Car = &lcub;
        make: string
        year: number
        maillage: number
        price: number
      &rcub;
      type PROPS = &lcub;
        parentCounter: (_: number) =&gt; void
        getParentCount: () =&gt; number
        car: Car
      &rcub;
      let &lcub; parentCounter, getParentCount, car = $bindable() &rcub;: PROPS = $props()
    &lt;/script&gt;

  On both sides child and parent input box values are bound to car.PROPERTIES so two way 
  communication ensures update at any side is propagated to the other side
  Values in Child are in lightgreen and in parent in yellow
</pre>

<style lang="scss">
	pre {
		position: absolute;
		top: 3rem;
		left: 40vw;
		font-size: 15px;
		color: skyblue;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 1rem 1rem 3rem 1rem;
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
		border: 1px solid gray;
		border-radius: 8px;
		padding: 0 2rem;
		margin: 6px 0 0 4rem;
	}
	input {
		width: 6rem !important;
		color: yellow !important;
	}
	.parent-estate {
		position: relative;
		margin: 3rem 0 0 4rem;
		width: max-content;
		padding: 6px 2rem;
		border: var(--BLOCK-BORDER);
		border-radius: var(--BLOCK-BORDER-RADIUS);
		&::before {
			position: absolute;
			top: -0.6rem;
			background-color: var(--BODY-BACKGROUND-COLOR);
			content: ' parent estate ';
		}
	}
	.lightgreen,
	.yellow {
		font-size: 1.3rem;
		color: lightgreen;
	}
	.yellow {
		color: yellow;
	}
	.info {
		margin: 0 0 0 4rem;
	}
</style>
