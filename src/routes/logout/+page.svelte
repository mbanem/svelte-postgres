<script lang="ts">
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'
	let btn: HTMLButtonElement
	onMount(() => {
		btn.click()
		return () => {
			utils.setMrPath($page.url.pathname)
		}
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
