<script lang="ts">
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
</script>

<p>NavBar Page</p>

<div class="wrapper">
	<h2>The Two NavBars Page</h2>
	<pre>
      Following through book Up and Running SvelteKit
  </pre>
</div>
