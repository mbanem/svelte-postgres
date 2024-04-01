<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	let success = '';
	let loading = false;
	let selectedAuthorId = '';
	let selectedUserWithBio: Bio;

	const createProfile: SubmitFunction = ({ action }) => {
		success = '';
		loading = true; // start spinner animation

		return async ({ update }) => {
			await update();
			loading = false; // stop spinner animation
			success = action.search.slice(2) === 'addTodo' ? 'New todo added' : 'All todos cleared';
			setTimeout(() => {
				// imitate network latency
				success = '';
			}, 3000);
		};
	};
	let adminSelected: boolean;
	let selectedUserName: string;
	let selBox: HTMLSelectElement;
	onMount(() => {
		selectedAuthorId = data.user.id;
		adminSelected = data.user.role === 'ADMIN';
		if (adminSelected) {
			if (data.users.length == 1) {
				selBox.selectedIndex = 1;
			} else {
				for (let i = 0; i < selBox.options.length; i++) {
					if (selBox.options[i]?.value.slice(2) === selectedAuthorId) {
						// @ts-expect-error
						selBox.options[i].selected = true;
					}
				}
			}
		}
		selectedUserName = `${data.user.firstName} ${data.user.lastName}`;
	});
	const userSelected = () => {
		selectedAuthorId = String(selBox.value).slice(2);
		adminSelected = String(selBox.value).slice(0, 1) === 'T';
		// @ts-expect-error
		selectedUserName = selBox.options[selBox.selectedIndex].text;
		// if no admin is selected hide boardBlock if not hidden already
		// if (boardBlock.classList.contains('hidden')) {
		// 	if (adminSelected) {
		// 		boardBlock.classList.toggle('hidden');
		// 	}
		// } else {
		// 	if (!adminSelected) {
		// 		boardBlock.classList.toggle('hidden');
		// 	}
		// }
	};
	const getUserWithBio = (id: string) => {
		for (let i = 0; i < queryProfiles.length; i++) {
			if (queryProfiles[i]?.user?.id === id) {
				const { id, bio, user } = queryProfiles[i];
				return { id, bio, user } as Bio;
			}
		}
	};
	let createBtn: HTMLButtonElement;
	let updateBtn: HTMLButtonElement;
	const toggleSubmitButtons = () => {
		createBtn.classList.toggle('hidden');
		updateBtn.classList.toggle('hidden');
	};
	let bioTextArea: HTMLTextAreaElement;
	const canBeUpdated = (event: MouseEvent) => {
		const divEl = event.currentTarget as HTMLDivElement;
		// instead of taking id easier as selectedUserWithBio?.user.id
		// we use here attribute dada-user-id as divEl.dataset.userId -- a string
		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		if (user.id === divEl.dataset.userId) {
			bioTextArea.value = selectedUserWithBio?.bio;
			toggleSubmitButtons();
		}
	};

	$: ({ user, users, queryProfiles } = data);
	$: selectedAuthorId = user.id;
	$: selectedUserWithBio = getUserWithBio(selectedAuthorId) || form?.bio || '';
</script>

<!-- <pre style="font-size:11px;">form {JSON.stringify(form, null, 2)}</pre> -->
<h1>Profile Page</h1>
<div class="author-list">
	<!-- <p>Selected AuthorId {JSON.stringify(selectedAuthorId, null, 2)}</p> -->
	<p>Select an Author</p>
	{#if user.role === 'ADMIN'}
		<select on:click={userSelected} bind:this={selBox} class="select-author">
			<option value="">Select Profile Author</option>
			{#each users as user}
				<option value="{user.role === 'ADMIN' ? 'T-' : 'F-'}{user.id}">
					{user.firstName}
					{user.lastName}
				</option>
			{/each}
		</select>
	{/if}
</div>

<div class="container">
	<div class="left-column">
		<div>
			Author Bio
			<form action="?/create" method="post" use:enhance={createProfile}>
				<textarea
					bind:this={bioTextArea}
					class="text-area"
					placeholder="Place bio here"
					rows={5}
					cols={35}
					name="bio"
					value={form?.success ? '' : form?.bio ?? ''}
				/>
				<input type="hidden" name="authorId" value={selectedAuthorId ?? ''} />
				<input type="hidden" name="bioId" value={selectedUserWithBio?.id ?? ''} />
				<button bind:this={createBtn} type="submit" disabled={selectedAuthorId === ''}
					>Create Profile</button
				>
				<button bind:this={updateBtn} type="submit" formaction="?/update" class="hidden"
					>Update Profile</button
				>
			</form>
		</div>
	</div>
	{#if selectedUserWithBio}
		<div class="right-column">
			<p>{selectedUserWithBio.user.firstName} {selectedUserWithBio.user.lastName}</p>
			<p
				class="bio"
				on:click={canBeUpdated}
				data-user-id={selectedUserWithBio.user.id}
				aria-hidden={true}
			>
				{selectedUserWithBio.bio ?? ''}
			</p>
		</div>
	{:else}
		<div class="right-column">There is no profile for this user</div>
	{/if}
</div>

<style lang="scss">
	.container {
		display: grid;
		gap: 1rem;
		width: 80vw;
		grid-template-columns: 1fr 3fr;
		text-align: center;
		// border: 1px solid gray;
		// width: 20em;
		.left-column {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			border: 1px solid gray;
			align-items: center;
			border-radius: 6px;
			padding-top: 1rem;
			// width: 30vw;
			p {
				text-align: left;
			}
			textarea {
				text-align: left;
				color: black;
				margin-top: 1rem;
			}
			button {
				display: block;
				color: black;
				font-size: 16px;
				margin: 1rem 0 0 3.5em;
				&:disabled {
					background-color: gray;
				}
			}
			.hidden {
				display: none;
			}
		}
		.right-column {
			border: 1px solid gray;
			border-radius: 6px;
			.bio {
				cursor: pointer;
			}
			// ul {
			// 	list-style: none;
			// 	li {
			// 		display: flex;
			// 		flex-direction: column;
			// 		align-items: flex-start;
			// 		justify-content: flex-start;
			// 		margin: 0;
			// 		padding: 0;
			// 		p:nth-child(1) {
			// 			color: yellow;
			// 			font-style: italic;
			// 			margin: 1rem 0 0 0;
			// 		}
			// 		p:nth-child(2) {
			// 			margin-top: 8px;
			// 			font-size: 14px;
			// 			text-align: left;
			// 		}
			// 	}
			// }
		}
	}
	.author-list {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}
	.select-author {
		padding-left: 2rem;
		width: 15rem;
		font-size: 16px;
		font-weight: 300;
		margin: 1rem 2.5rem 0 0;
		:focus {
			outline: 2px dashed red;
		}
	}

	// ul {
	// 	display: flex;
	// 	flex-direction: column;
	// 	text-align: center;
	// 	margin: 2px auto;
	// }
</style>
