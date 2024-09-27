<<<<<<< HEAD
<script lang="ts">
	import Bindable from '$components/Bindable.svelte'
	let count = 12 //$state(22);

	const click = () => {
		count++
		// console.log('parent click', count);
	}
	// child calls parent's function to update parent's count
	const clickArg = (delta: number, _?: MouseEvent) => {
		count = count + delta
	}

	// ------------  parent to call child function to update its local childCount -------------

	let childComponent: Bindable

	// for parent to call child function it has to have reference to the
	// child component by binding this way <Child bind:this={childComponent}...
	// and child component must export the function like
	//   export const counter = (delta: number) => (childCount += delta);
	// then calling child function 'counter' could be done like this:
	// 					childComponent.counter(value)
	// Even if child variable is defined as 'export let childVar = 0' it cannot
	// be updated from parent via childComponent.childVar += 1
	// so only the exported functions can be used from parent

	const getRandomInt = () => {
		return Math.round(Math.random() * 10000)
	}
	const callChildCounter = () => {
		console.log('callChildCounter')
		childComponent.counter(getRandomInt())
	}
</script>

<div>
	<p class="label-title">This is parent block with count managed by its bindable component.</p>

	<button onclick={click}>parent count {count} </button>
	<p style="display:inline-block">
		Parent count <span class="expression-highlighted">{count}</span>
	</p>
</div>
<pre>
The Count variable is defined at parent as a let count = 22 with no $state(22) and <i>bound</i
	> as a prop to child as
	&lt;Bindable bind=&lcub;clickArg&rcub; so that
parent has access to it and could change it via button 'parent click'
It is accepted at child as a $bindable() count prop  as
	let &lcub; count = $bindable() &rcub; = $props()
so child can update parent's count with a button 'child click'
To update the count by arbitrary delta we define parent function clickArg(event:MouseEvent, delta:number)
and sent it to child component "Bindable" as the second prop &lcub;clickArg&rcub;
	&lt;Bindable bind:count  bind=&lcub;clickArg&rcub;
which is accepted at child as clickArg = $bindable() as of type Handler
	type Handler = (event: MouseEvent, delta: number) =&gt; void;
In child we set delta using input of type number and via  button 'update by delta = "delta"'
we call child local function 'updateParentCount' which in turn calls parent's clickArg(event,delta)
with child click event:MouseEvent and value of delta bound in &lt;input type='number' bind:value=&lcub;delta&rcub;
</pre>
<br />
<button style="margin-left:2rem;" onclick={callChildCounter}>
	call child counter to increment its count
</button>
<Bindable bind:count {clickArg} bind:this={childComponent} />

<style>
	pre {
		margin: 5px 0 5px 2rem;
		border: 1px solid gray;
		padding: 1rem;
		font-size: 15px;
	}
	button {
		display: inline-block;
	}
	.label-title {
		margin: 6px 0 0 2rem;
	}
</style>
=======
<script lang="ts">
	import Bindable from '$components/Bindable.svelte'
	let count = 12 //$state(22);

	const click = () => {
		count++
		// console.log('parent click', count);
	}
	// child calls parent's function to update parent's count
	const clickArg = (delta: number, _?: MouseEvent) => {
		console.log('parent clickArg ', delta)
		count = count + delta
	}

	// ------------  parent to call child function to update its local childCount -------------

	let childComponent: Bindable

	// for parent to call child function it has to have reference to the
	// child component by binding this way <Child bind:this={childComponent}...
	// and child component must export the function like
	//   export const counter = (delta: number) => (childCount += delta);
	// then calling child function 'counter' could be done like this:
	// 					childComponent.counter(value)
	// Even if child variable is defined as 'export let childVar = 0' it cannot
	// be updated from parent via childComponent.childVar += 1
	// so only the exported functions can be used from parent

	const getRandomInt = () => {
		return Math.round(Math.random() * 10000)
	}
	const callChildCounter = () => {
		console.log('callChildCounter')
		childComponent.counter(getRandomInt())
	}
</script>

<div>
	<p class="label-title">This is parent block with count managed by its bindable component.</p>

	<button onclick={click}>parent count {count} </button>
	<p style="display:inline-block">
		Parent count <span class="expression-highlighted">{count}</span>
	</p>
</div>
<pre>
The Count variable is defined at parent as a let count = 22 with no $state(22) and <i>bound</i
	> as a prop to child as
	&lt;Bindable bind=&lcub;clickArg&rcub; so that
parent has access to it and could change it via button 'parent click'
It is accepted at child as a $bindable() count prop  as
	let &lcub; count = $bindable() &rcub; = $props()
so child can update parent's count with a button 'child click'
To update the count by arbitrary delta we define parent function clickArg(event:MouseEvent, delta:number)
and sent it to child component "Bindable" as the second prop &lcub;clickArg&rcub;
	&lt;Bindable bind:count  bind=&lcub;clickArg&rcub;
which is accepted at child as clickArg = $bindable() as of type Handler
	type Handler = (event: MouseEvent, delta: number) =&gt; void;
In child we set delta using input of type number and via  button 'update by delta = "delta"'
we call child local function 'updateParentCount' which in turn calls parent's clickArg(event,delta)
with child click event:MouseEvent and value of delta bound in &lt;input type='number' bind:value=&lcub;delta&rcub;
</pre>
<br />
<button style="margin-left:2rem;" onclick={callChildCounter}>
	call child counter to increment its count
</button>
<Bindable bind:count {clickArg} bind:this={childComponent} />

<style>
	/* pre {
		margin: 5px 0 5px 2rem;
		border: 1px solid gray;
		padding: 1rem;
		font-size: 15px;
	} */
	button {
		display: inline-block;
	}
	.label-title {
		margin: 6px 0 0 2rem;
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
