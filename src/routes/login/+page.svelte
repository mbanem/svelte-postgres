<script lang="ts">
	import type { Snapshot } from '../$types'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { onMount, getContext } from 'svelte'
	import type { ActionData } from './$types'
	import * as utils from '$utils'

	export let form: ActionData
	$: data = form?.data

	let snap = {
		firstName: '',
		lastName: '',
		email: ''
	}
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			snap = value
		}
	}
	let mrPath = getContext('mrPath') as SvelteStore<string>

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<h1>Log In</h1>
<div class="container">
	{#if form?.data}
		<p class="error">Insufficient or incorrect data supplied</p>
	{/if}
	<form method="POST" action="?/login" use:enhance>
		<div>
			<label for="firstName">
				First Name
				<input type="text" id="firstName" name="firstName" bind:value={snap.firstName} />
			</label>
		</div>
		<div>
			<label for="lastName">
				Last Name
				<input type="text" id="lastName" name="lastName" bind:value={snap.lastName} />
			</label>
		</div>
		<div>
			<label for="email">
				Email
				<input type="text" id="email" name="email" bind:value={snap.email} />
			</label>
		</div>
		<div>
			<label for="password">
				Password
				<input type="password" name="password" />
			</label>
		</div>
		<button type="submit">login</button>
	</form>
</div>

<style lang="scss">
	.container {
		width: 20rem;
		margin: 3rem auto;
		padding: 1rem;
	}
</style>
