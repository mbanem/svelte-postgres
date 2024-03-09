<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
</script>

<div class="container">
	{#if user}
		<p class="name">{user.firstName} {user.lastName}</p>
		<p class="email">email {user.email}</p>
	{/if}
</div>

<style lang="scss">
	.name {
		font-size: 25px;
		color: yellow;
	}
	.email {
		color: rgb(136, 194, 244);
		font-size: 18px;
		font-style: italic;
	}
</style>
