<script lang="ts">
	import { onMount, getContext } from 'svelte'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'

	import type { PageData } from './$types'

	let { data } = $props()

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<main class="container">
	<h1>Admin Page</h1>
	<pre>this is an empty page just to show it is protected and accessible only by ADMIN
</pre>
	<pre style="font-size:14px;">$page content holds data as well {JSON.stringify(
			$page,
			null,
			2
		)}</pre>
</main>

<style lang="scss">
	.container {
		margin: 1rem 0 0 4rem;
	}
</style>
