<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { page } from '$app/stores';

	let mrPath = getContext('mrPath');
	onMount(() => {
		return () => {
			// @ts-expect-error
			mrPath.set($page.url.pathname);
		};
	});
</script>

<h1>Admin Page</h1>
<pre>this is an empty page just to show it
is protected and accessible only by ADMIN
</pre>
