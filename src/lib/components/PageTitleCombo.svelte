<script lang="ts">
	import { onMount } from 'svelte';

	export let PageName: string;
	export let user: Partial<User>;
	export let amendTFUserId = false;
	export let selectedUserId: string;
	export let users: Partial<User>[];
	export let result: string = '';
	export let message: string = '';
	export let ignoreFormMessage: boolean = false;

	let msgEl: HTMLSpanElement;
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			result = '';
			ignoreFormMessage = true;
			msgEl.innerText = '';
		}, 2000);
	};
	const showResult = () => {
		clearMessage();
		return result;
	};
	let selectBox: HTMLSelectElement;
	onMount(() => {
		const t = amendTFUserId ? (user.role === 'ADMIN' ? '-T' : '-F') : '';
		selectedUserId = `${user.id}${t}`;
		console.log('selectBox.value is ', user.id);
	});
	console.log('user.id', user.id);
</script>

<!-- <pre style="font-size:11px;">selectedUserId {JSON.stringify(selectedUserId, null, 2)}</pre> -->
<h1>
	{PageName} Page
	{#if user.role === 'ADMIN'}
		<select bind:this={selectBox} bind:value={selectedUserId}>
			<option value="" selected>Select {PageName} Author</option>
			{#each users as the_user}
				<option value={the_user.id}>
					{the_user.firstName}
					{the_user.lastName}
				</option>
			{/each}
		</select>
	{/if}
	{#if result}
		<span bind:this={msgEl} class="message">{showResult()}</span>
	{/if}
	<span class="user-name">{user.firstName} {user.lastName}</span>
</h1>

<style lang="scss">
	h1 {
		display: flex;
		align-items: baseline;
		margin-left: 1rem;
		.message,
		.user-name {
			display: inline-block;
			font-size: 14px;
			font-weight: 100;
			color: yellow;
			margin-left: 1rem;
		}
		.user-name {
			color: white;
		}
		select {
			margin-left: 1rem;
		}
	}
</style>
