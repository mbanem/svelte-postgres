<script lang="ts">
	import { enhance } from '$app/forms';
	import { setColor } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';
	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';

	export let form: ActionData;
	$: data = form?.data;

	let firstNameIsRequired = '';
	let lastNameIsRequired = '';
	let emailIsRequired = '';
	let passwordIsRequired = '';

	let loading = false;
	let ignoreFormMessage = false;
	const enhanceRegister: SubmitFunction = ({ action, formData }) => {
		['firstName', 'lastName', 'email', 'password'].forEach((name) => {
			if (formData.get(name) === '')
				`${name}IsRequired=${name[0]?.toUpperCase()}${name.slice(1)} is required`;
		});
		loading = true;
		ignoreFormMessage = true;
		// cannot use $page.status === 200 as on successful login we redirect to thr home page
		message = action.search === '?/register' ? 'registering account...' : 'updating account...';
	};
	let result: string;
	$: setColor(form?.message ? (form.message.includes('successfully') ? 'green' : 'red') : 'green');
	$: message = form?.message || '';
</script>

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
					value={data?.firstName || ''}
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
					value={data?.lastName || ''}
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
					value={data?.email || ''}
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
	button {
		color: black;
	}
	.error {
		color: yellow;
	}
</style>
