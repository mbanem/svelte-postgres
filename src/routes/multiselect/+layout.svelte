<script lang="ts">
	import type { LayoutData } from './$types';
	// +page.server.ts send categories from its load function
	// that we can get as data object
	export let data: LayoutData;
</script>

<div class="submenu">
	{#each data.sections as section}
		<a href="/multiselect/{section.slug}">{section.title}</a>
	{/each}
</div>
<h4>Layout for SelectBox and SelectList Pages</h4>

<slot />

<style lang="scss">
	a {
		width: 5rem;
		padding: 2px 1rem;
		border: 1px solid gray;
		border-radius: 4px;
		&:hover {
			color: yellow;
		}
	}
	.submenu {
		display: flex;
		gap: 1rem;
		align-items: baseline;
		height: 2rem;
		margin: 1rem 0 0 1rem;
	}
	h4 {
		// margin-top: 2rem;
		color: skyblue;
		font-weight: 300;
	}
</style>
