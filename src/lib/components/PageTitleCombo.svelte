<script lang="ts">
	import { onMount } from 'svelte'

	type ARGS = {
		PageName: string
		user: UserPartial
		users: UserPartial[] | []
		amendTrueFalseUserId: boolean
		selectedUserId: string
		result: string
		message: string
		ignoreFormMessage: boolean
	}
	let {
		PageName,
		result = $bindable(),
		message = $bindable(),
		ignoreFormMessage = $bindable(),
		selectedUserId = $bindable(),
		amendTrueFalseUserId,
		user,
		users
	}: ARGS = $props()

	let msgEl: HTMLSpanElement
	const clearMessage = () => {
		setTimeout(() => {
			message = ''
			result = ''
			ignoreFormMessage = true
			if (msgEl) {
				msgEl.innerText = ''
			}
		}, 2000)
	}
	const showResult = () => {
		clearMessage()
		return result
	}
	let selectBox: HTMLSelectElement
	onMount(() => {
		const t = amendTrueFalseUserId ? (user.role === 'ADMIN' ? '-T' : '-F') : ''
		selectedUserId = `${user.id}${t}`
	})
</script>

<!-- <pre style="font-size:11px;">selectedUserId {JSON.stringify(selectedUserId, null, 2)}</pre> -->
<h1>
	{PageName} Page
	{#if user?.role === 'ADMIN'}
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
	<span class="user-name">{user?.firstName} {user?.lastName}</span>
	{#key result}
		{#if result !== ''}
			<span bind:this={msgEl} class="message">{showResult()}</span>
		{/if}
	{/key}
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
