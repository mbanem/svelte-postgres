<script lang="ts" module>
	// child component to update local childCount when called from parent
	let childCount = $state<number>(0)
	export const counter = (delta: number) => {
		childCount += delta
		console.log('parent call ', delta)
	}
</script>

<script lang="ts">
	type Handler = (delta: number, event?: MouseEvent) => void
	type ARGS = {
		count: number
		clickArg: Handler
	}
	let { count = $bindable(0), clickArg = $bindable() }: ARGS = $props()

	const increment = () => {
		count += 1
	}
	let delta = $state<number>(-3)
	const updateParentCount = (event: MouseEvent) => {
		clickArg(delta, event)
	}
</script>

<p class="inline">child local counter <span class="expression-highlighted">{childCount}</span></p>
<p>CHILD SPACE: child count updated by parent {childCount}</p>
<div class="wrapper">
	<pre>This is child component.
Child button clicked changing parent count<span class="expression-highlighted"> {count}</span>
</pre>
	<!-- the pre css rules change button css rules dramatically
		so as the first line of defense get otu of pre as parent
-->
	<button style="display:block;" onclick={increment}>
		child click changing sharable bound count variable</button
	>
	Parents clickArg (_:number)=&gt; void updates parent's count calling parent's function
	<label for="delta"
		>Delta
		<input id="delta" type="number" bind:value={delta} />
	</label>
	<button class="update-parent-button" onclick={updateParentCount}>
		call parent to update its count by delta={delta}
	</button>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
	.expression-highlighted {
		font-size: 24px;
		color: yellow;
	}
	.wrapper {
		// display: inline-block;
		width: 60.5vw;
		margin: 0 0 0 2rem;
		padding: 0 1rem;
		border: 1px solid gray;
		border-radius: 8px;
		p {
			color: skyblue;
			border: 0;
			padding: 0;
		}
	}
	.inline {
		display: inline-block;
	}
	pre {
		font-size: 15px;
	}
</style>
