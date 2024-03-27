<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: data = form?.data;
</script>

<h1>Register</h1>
<div class="container">
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
	<form method="POST" action="?/register" use:enhance>
		<div>
			<label for="firstName">
				First Name
				<input type="text" name="firstName" value={data?.firstName ?? ''} />
			</label>
		</div>
		<div>
			<label for="lastName">
				Last Name
				<input type="text" name="lastName" value={data?.lastName ?? ''} />
			</label>
		</div>
		<div>
			<label for="email">
				Email
				<input type="text" name="email" value={data?.email ?? ''} />
			</label>
		</div>
		<div>
			<label for="password">
				Password
				<input type="password" name="password" />
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
