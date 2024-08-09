<script lang="ts">
	import { onMount } from 'svelte'

	type ARGS = {
		PageName: string
		user: UserPartial
		users: UserPartial[] | []
		amendTrueFalseUserId: boolean
		selectedUserId: string
		result: string
		ignoreFormMessage: boolean
	}
	let {
		PageName,
		result = $bindable(),
		ignoreFormMessage = $bindable(),
		selectedUserId = $bindable(),
		amendTrueFalseUserId,
		user,
		users
	}: ARGS = $props()

	if (users.length === 0) {
		users[0] = user as UserPartial
	}

	let msgEl: HTMLSpanElement
	let selectBox: HTMLSelectElement
	const clearMessage = () => {
		setTimeout(() => {
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
	let userName = $derived.by(() => {
		let aUser = users.filter((u) => u.id === selectedUserId)[0] as UserPartial
		if (aUser) {
			return `${aUser?.firstName} ${aUser?.lastName}`
		} else {
			return `${user.firstName} ${user.lastName}`
		}
	})
	// $effect(() => {
	// 	selectBox.value = selectedUserId.slice(0, -2)
	// })
	onMount(() => {
		const t = amendTrueFalseUserId ? (user.role === 'ADMIN' ? '-T' : '-F') : ''
		selectedUserId = `${user.id}${t}`
		selectBox.value = selectedUserId //.slice(0, -2)
	})
</script>

<!-- <pre style="font-size:16px;">selectedUserId-T/-F {JSON.stringify(selectedUserId, null, 2)}</pre> -->
<h1>
	{PageName} Page
	{#if user?.role === 'ADMIN'}
		<select bind:this={selectBox} bind:value={selectedUserId}>
			<!-- <option value="x" selected={true}>Select an Author</option> -->
			{#each users as the_user}
				<option value={the_user.id}>
					{the_user.firstName}
					{the_user.lastName}
				</option>
			{/each}
		</select>
	{/if}
	<span class="user-name">{userName}</span>
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
