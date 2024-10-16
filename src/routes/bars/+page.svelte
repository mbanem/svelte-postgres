<script lang="ts">
	import * as utils from '$utils'
	// import { page } from '$app/stores' // for $age.status code on actions

	import { onMount } from 'svelte'
	type TButtons = { title: string; href: string; cssRules?: string; onHover?: string }[]
	type TProps = Array<Array<string>>
	// import NavBar from '$lib/components/NavBar.svelte'

	const buttons: TButtons = [
		{ title: 'home', href: '/' },
		{ title: 'news', href: '/news' }
	]
	const props: TProps = [
		['home', '/#home', 'color:yellow;', 'border: 1px solid blue;'],
		['comments', '/comments', '', 'border: 1px solid yellow;']
	]
	onMount(() => {
		return () => {
			utils.setMrPath('/bars')
		}
	})
</script>

<div class="wrapper">
	<h2>The Two NavBars Page</h2>
	<pre>
      Following through the book "Up and Running SvelteKit"
  </pre>
</div>

<style lang="scss">
	.wrapper {
		margin: 2rem 0 0 3rem;
	}
</style>
