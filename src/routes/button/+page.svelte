<script lang="ts">
	import Button from '$components/Button.svelte'
	let count = 0

	const handleClick = (_: MouseEvent, delta: number) => {
		count += delta
	}
</script>

<div class="main">
	<Button {handleClick} />
	<p>Parent count handled by child: <span class="expression-highlighted">count = {count}</span></p>
</div>
<pre>
	This parent page sends a handleClick function which expects two arguments
		(event: MouseEvent,  delta: number)
	to child component Button as a prop
		&lt;Button &lcub; handleClick &rcub; /&gt;

	Child component Button gets properties (function reference) by defining props type

	type Handler = (event: MouseEvent, delta: number) =&gt; void;

	and get props by destructuring returns from the call to the $props()
	let &lcub; handleClick &rcub;: &lcub; handleClick: Handler &rcub; = $props();

	Notice that type Handler is a function type getting two args
	but parent specifies only function reference to the handler
	function mentioning no args, so type Handler ensures two arg existence

	NOTE: count is defined at parent while delta at child and is set as
	let delta = $state&lt;number&gt;(4)	in order to make button titles
	adjust with changing the delta via input box of type number
</pre>

<style lang="scss">
	.main {
		margin: 2rem 0 0 2rem;
	}
</style>
