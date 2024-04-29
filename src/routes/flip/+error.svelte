<script lang="ts">
	import { page } from '$app/stores';
</script>

<h2>Custom +error.svelte Page</h2>

<h4>{$page.status}: {$page.error?.message ?? 'could not obtain error'}</h4>

<a href="/flip"><button>back</button></a>
