<script lang="ts">
	type ARGS = {
		size: number
		power: number
		inflate: (n: number) => void
		deflate: (n: number) => void
	}

	let { inflate, deflate, size = $bindable(), power = $bindable() }: ARGS = $props()
</script>

<div class="wrapper">
	This is child block
	<button onclick={() => inflate(power)}>inflate</button>
	<button onclick={() => deflate(power)}>deflate</button>

	<pre>We can change parent's pump power from child
Pump power: {power} <button onclick={() => power--}>-</button>  <button onclick={() => power++}
			>+</button
		>
	</pre>
</div>

<!-- svelte-ignore css_unused_selector -->
<style lang="scss">
	.wrapper {
		padding: 1rem;
	}
	button {
		display: inline-block;
	}
</style>
