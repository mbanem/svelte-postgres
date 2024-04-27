<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: data = form?.data;
</script>

<h1>Log In</h1>
<div class="container">
	{#if form?.data}
		<p class="error">Insufficient or incorrect data supplied</p>
	{/if}
	<form method="POST" action="?/login" use:enhance>
		<div>
			<label for="firstName">
				First Name
				<input type="text" id="firstName" name="firstName" value={data?.firstName ?? ''} />
			</label>
		</div>
		<div>
			<label for="lastName">
				Last Name
				<input type="text" id="lastName" name="lastName" value={data?.lastName ?? ''} />
			</label>
		</div>
		<div>
			<label for="email">
				Email
				<input type="text" id="email" name="email" value={data?.email ?? ''} />
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
