<script lang="ts">
	// child component to update local childCount when called from parent
	let childCount = $state<number>(0);
	export const counter = (delta: number) => (childCount += delta);

	// let { bindableProp = $bindable('fallback') } = $props();	// the default if parent value is missing
	// let { count = $bindable() }: { count: any } = $props();
	// type ARGS = { count: any};
	type Handler = (delta: number, event?: MouseEvent) => void;
	type ARGS = {
		count: number;
		clickArg: Handler;
	};
	let { count = $bindable(0), clickArg = $bindable() }: ARGS = $props();

	const increment = () => {
		count += 1;
	};
	let delta = $state<number>(-3);
	const updateParentCount = (event: MouseEvent) => {
		clickArg(delta, event);
	};
</script>

<p class="inline">child local counter <span class="count">{childCount}</span></p>

<div class="wrapper">
	<pre>This is child component.
Child button clicked changing parent count<span class="count"> {count}</span></pre>
	<button style="width:15rem;display:inline-block;" onclick={increment}
		>child click calling parent func
	</button>
	<pre>Parents clickArg (_:number)=&gt; void
	updates parent's count calling parent's function
	</pre>
	<label for="delta"
		>Delta
		<input id="delta" type="number" bind:value={delta} /></label
	>
	<button class="update-parent-button" onclick={updateParentCount}>
		call parent to update its count by delta = {delta}
	</button>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
	.count {
		font-size: 24px;
		color: yellow;
	}
	.wrapper {
		// display: inline-block;
		margin: 1rem 0 1rem 2rem;
		padding: 5px 1rem;
		border: 1px solid gray;
		border-radius: 8px;
		p {
			color: skyblue;
			border: 0;
			padding: 0;
		}
		.update-parent-button {
			width: 11rem;
		}
		.count {
			font-size: 20px;
			color: yellow;
		}
	}
	.inline {
		display: inline-block;
	}
</style>
