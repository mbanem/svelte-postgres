<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="container">
	<h2>Custom +error.svelte Page</h2>

	<h4 style="color:pink;font-style:italic">
		{$page.status}: {$page.error?.message ?? 'could not obtain error'}
	</h4>

	<a href="/flip" class="a-button">back</a>
</div>

<style lang="scss">
	.button {
		display: inline-block;
	}
	.container {
		margin: 5rem 0 0 10rem;
		h2 {
			display: inline-block;
			width: 20rem;
			margin-left: -2.8rem;
			color: lightgreen;
		}
	}
</style>
