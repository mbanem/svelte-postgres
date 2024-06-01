<script lang="ts">
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'

	let btn: HTMLButtonElement
	onMount(() => {
		btn.click()
	})
</script>

<h2>Successively logged out</h2>
<a href="/login">log in</a>
<br />
<a href="/">home</a>
<form use:enhance method="POST" action="?/logout">
	<input type="hidden" name="first_name" id="first_name" />
	<button bind:this={btn} style="display:none">log in</button>
</form>
