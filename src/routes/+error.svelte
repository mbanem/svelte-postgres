<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="container">
	<h1>Error</h1>

	<pre class="text">
	Even though you're on the <b>{$page.url.pathname}</b> route
	this is not the <code>+page.svelte</code> component
	but the <code>+error.svelte</code> component.
	{JSON.stringify($page.error?.message)}
</pre>
</div>

<style lang="scss">
	.text {
		font-size: 18px;
		color: lightgreen;
		code {
			font-size: 18px;
			color: skyblue;
		}
	}
	.container {
		border: 1px solid gray;
		width: 70vw;
		border-radius: 10px;
		margin: 2rem;
		padding: 2rem;
	}
</style>
