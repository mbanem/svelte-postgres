<script lang="ts">
	export let PageName: string;
	export let user: any;
	export let selectedUserId: string;
	export let users: any[];
	export let result: string = '';
	export let saving: string = '';
	export let deleted: string = '';
	export let toggled: string = '';
	export let ignoreMessage: boolean = false;

	let msgEl: HTMLSpanElement;
	const clearMessage = () => {
		setTimeout(() => {
			deleted = '';
			toggled = '';
			saving = '';
			result = '';
			ignoreMessage = true;
			msgEl.innerText = '';
		}, 2000);
	};
	const showResult = () => {
		clearMessage();
		return result;
	};
</script>

<h1>
	{PageName} Page
	{#if user.role === 'ADMIN'}
		<select class="select-author" bind:value={selectedUserId}>
			<option value="" selected>Select {PageName} Author</option>
			{#each users as user}
				<option value={user.id}>
					{user.firstName}
					{user.lastName}
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
