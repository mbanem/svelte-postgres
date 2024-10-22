<script lang="ts">
	type PROPS = {
		size: number
		power: number
		inflate: (n: number) => void
		deflate: (n: number) => void
	}
	// componwent get props
	let { inflate, deflate, size = $bindable(), power = $bindable() }: PROPS = $props()
</script>

<div class="wrapper">
	This is a child block
	<button onclick={() => inflate(power)}>inflate</button>
	<button onclick={() => deflate(power)}>deflate</button>

	<pre>We can change parent's pump power from the child
Pump power: &lcub;power&rcub; 
&lt;button onclick&eq;&lcub;() &eq;&gt; power--&rcub;&gt;-&lt;/button&gt;  &lt;button onclick="&lcub;()" &eq;&gt; power++&rcub;
			&gt;+&lt;/button
		&gtl
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
