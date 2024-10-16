
<script lang="ts">
	import type { Snapshot } from '../$types' // .sveltekit/$types
	import { page } from '$app/stores'
	import { onMount, getContext } from 'svelte'
	import { enhance } from '$app/forms'
	import * as utils from '$utils'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { ActionData } from './$types'

	let { data } = $props()
	// let data = $derived(form.data)
	let firstNameIsRequired = ''
	let lastNameIsRequired = ''
	let emailIsRequired = ''
	let passwordIsRequired = ''

	let loading = false
	let ignoreFormMessage = false
	const enhanceRegister: SubmitFunction = ({ action, formData }) => {
		;['firstName', 'lastName', 'email', 'password'].forEach((name) => {
			if (formData.get(name) === '')
				`${name}IsRequired=${name[0]?.toUpperCase()}${name.slice(1)} is required`
		})
		loading = true
		ignoreFormMessage = true
		// cannot use $page.status === 200 as on successful login we redirect to the home page
		message = action.search === '?/register' ? 'registering account...' : 'updating account...'
	}
	let result: string
	let message: string
	$effect(() => {
		utils.setColor(
			data?.message ? (data.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
		message = data?.message || ''
	})

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

	// const shallowCopy = (source: Object, target: Object) => {
	// 	for (const [k, v] of Object.entries(source)) {
	// 		target[key] = v;
	// 	}
	// };
	onMount(() => {
		// shallowCopy(data as Object, snap);
		if (data?.data) {
			snap = data.data
		}
		return () => {
			// @ts-expect-error
			utils.setMrPath.set($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<h2>Register Page</h2>

<div class="container">
	{#if data?.message}
		<p class="error">{data.message}</p>
	{/if}
	<form method="POST" action="?/register" use:enhance={enhanceRegister}>
		<div>
			<label for="firstName">
				First Name
				<input
					type="text"
					name="firstName"
					bind:value={snap.firstName}
					placeholder={firstNameIsRequired || 'Enter first name here'}
				/>
			</label>
		</div>
		<div>
			<label for="lastName">
				Last Name
				<input
					type="text"
					name="lastName"
					bind:value={snap.lastName}
					placeholder={lastNameIsRequired || 'Enter last name here'}
				/>
			</label>
		</div>
		<div>
			<label for="email">
				Email
				<input
					type="text"
					name="email"
					bind:value={snap.email}
					placeholder={emailIsRequired || 'Enter email here'}
				/>
			</label>
		</div>
		<div>
			<label for="password">
				Password
				<input
					type="password"
					name="password"
					placeholder={passwordIsRequired || 'Enter password here'}
				/>
			</label>
		</div>
		<button type="submit">Register</button>
	</form>
</div>

<style lang="scss">
	.container {
		width: 20rem;
		margin: 3rem auto;
		padding: 1rem;
	}
	.error {
		color: pink;
	}
</style>

<script lang="ts">
	import type { Snapshot } from '../$types' // .sveltekit/$types
	import { page } from '$app/stores'
	import { onMount, getContext } from 'svelte'
	import { enhance } from '$app/forms'
	import * as utils from '$utils'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { ActionData } from './$types'

	let { data, form } = $props()
	// let data = $derived(form.data)

	let firstNameIsRequired = ''
	let lastNameIsRequired = ''
	let emailIsRequired = ''
	let passwordIsRequired = ''

	let loading = false
	let ignoreFormMessage = false
	const enhanceRegister: SubmitFunction = ({ action, formData }) => {
		;['firstName', 'lastName', 'email', 'password'].forEach((name) => {
			if (formData.get(name) === '')
				`${name}IsRequired=${name[0]?.toUpperCase()}${name.slice(1)} is required`
		})
		loading = true
		ignoreFormMessage = true
		// cannot use $page.status === 200 as on successful login we redirect to the home page
		message = action.search === '?/register' ? 'registering account...' : 'updating account...'
	}
	let result: string
	let message: string
	$effect(() => {
		utils.setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
		message = form?.message || ''
	})

	type RegisterSnap = {
		firstName: string
		lastName: string
		email: string
	}
	let snap = $state<RegisterSnap>({
		firstName: '',
		lastName: '',
		email: ''
	})
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			snap = value
		}
	}

	// const shallowCopy = (source: Object, target: Object) => {
	// 	for (const [k, v] of Object.entries(source)) {
	// 		target[key] = v;
	// 	}
	// };
	onMount(() => {
		utils.shallowCopy(data, snap)
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<h2>Register Page</h2>

<div class="container">
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
	<form method="POST" action="?/register" use:enhance={enhanceRegister}>
		<div>
			<label for="firstName">
				First Name
				<input
					type="text"
					name="firstName"
					bind:value={snap.firstName}
					placeholder={firstNameIsRequired || 'Enter first name here'}
				/>
			</label>
		</div>
		<div>
			<label for="lastName">
				Last Name
				<input
					type="text"
					name="lastName"
					bind:value={snap.lastName}
					placeholder={lastNameIsRequired || 'Enter last name here'}
				/>
			</label>
		</div>
		<div>
			<label for="email">
				Email
				<input
					type="text"
					name="email"
					bind:value={snap.email}
					placeholder={emailIsRequired || 'Enter email here'}
				/>
			</label>
		</div>
		<div>
			<label for="password">
				Password
				<input
					type="password"
					name="password"
					placeholder={passwordIsRequired || 'Enter password here'}
				/>
			</label>
		</div>
		<button type="submit">Register</button>
	</form>
</div>

<style lang="scss">
	.container {
		width: 20rem;
		margin: 3rem auto;
		padding: 1rem;
	}
	.error {
		color: pink;
	}
</style>

