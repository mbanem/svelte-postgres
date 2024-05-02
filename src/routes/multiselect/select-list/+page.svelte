<script lang="ts">
	import type { PageData } from './$types';
	import SelectBox from '$lib/components/MultiSelectBox.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>SelectList</title>
</svelte:head>

<h1 style="color:lightgreen;font-weight:400;">SelectList page</h1>

<SelectBox categories={data.categories} />
