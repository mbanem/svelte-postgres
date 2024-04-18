<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores'; // for $age.status code on actions
	import { setColor, setButtonVisible } from '$lib/utils';
	import { onMount } from 'svelte';

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';

	export let data: PageData;
	export let form: ActionData;
	let message = '';
	let bioIsRequired = '';
	// form?.message cannot be cleared by code but could be ignored when necessary
	let ignoreFormMessage = false;
	let success = '';
	let loading = false;
	let selectedUserId = '';
	let selectedUserWithBio: Bio;

	$: setColor(form?.message ? 'red' : 'green'); // toggle color for a message

	// if form is fill with  data for update but user chose other action we
	// clear form input elements
	const resetForm = () => {
		(document.querySelector("input[name='bio']") as HTMLTextAreaElement).value = '';
		(document.querySelector("input[name='authorId']") as HTMLInputElement).value = '';
		(document.querySelector("input[name='bioId']") as HTMLInputElement).value = '';
	};
	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			ignoreFormMessage = false;
			result = '';
		}, 2000);
	};
	const enhanceCreateProfile: SubmitFunction = ({ action, formData }) => {
		message = '';
		bioIsRequired = '';
		ignoreFormMessage = false;
		let bio = formData.get('bio');
		if (bio === '') {
			bioIsRequired = 'Biography is required field';
			return;
		}
		loading = true; // start spinner animation
		return async ({ update }) => {
			await update();
			loading = false; // stop spinner animation
			message =
				action.search === '?/create'
					? $page.status === 200
						? 'Profile added'
						: 'create failed'
					: 'error occurred';
			message =
				action.search === '?/update'
					? $page.status === 200
						? 'Profile updated'
						: 'Update failed'
					: 'error occurred';

			setButtonVisible(btnCreate, btnUpdate, 'create');
			clearMessage();
			if (action.search === '?/update') {
				selectedUserWithBio.bio = bio as string;
			}
		};
	};
	let adminSelected: boolean;
	let selectedUserName: string;
	// let selBox: HTMLSelectElement;
	onMount(() => {
		// selectedUserId = data.locals.user.id;
		adminSelected = data.locals.user.role === 'ADMIN';
		selectedUserName = `${data.locals.user.firstName} ${data.locals.user.lastName}`;
	});

	const getUserWithBio = (id: string): Bio | undefined => {
		for (let i = 0; i < userProfiles.length; i++) {
			if (userProfiles[i]?.user?.id === id) {
				// @ts-expect-error
				const { id, bio, user } = userProfiles[i] as UserProfile;
				return { id, bio, user } as Bio;
			}
		}
	};
	let btnCreate: HTMLButtonElement;
	let btnUpdate: HTMLButtonElement;

	let bioTextArea: HTMLTextAreaElement;
	const canBeUpdated = (event: MouseEvent) => {
		const divEl = event.currentTarget as HTMLDivElement;
		// instead of taking id easier as selectedUserWithBio?.user.id
		// we use here attribute dada-user-id as divEl.dataset.userId -- a string
		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		if (data.locals.user.id === divEl.dataset.userId) {
			bioTextArea.value = selectedUserWithBio?.bio;
			setButtonVisible(btnCreate, btnUpdate, 'update');
		}
	};

	$: ({ users, userProfiles } = data);
	// $: selectedUserId = data.locals.user.id;
	$: selectedUserWithBio = getUserWithBio(selectedUserId) as Bio;
	$: formMessage = ignoreFormMessage ? '' : form?.message ?? '';
	$: result = message || formMessage;
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId
	PageName="Profile"
	user={data.locals.user}
	users={data.users}
/>
<!-- <pre style="font-size:11px;">form {JSON.stringify(form, null, 2)}</pre> -->

<div class="container">
	<div class="left-column">
		<div>
			User Bio
			<form action="?/create" method="post" use:enhance={enhanceCreateProfile}>
				<textarea
					bind:this={bioTextArea}
					class="text-area"
					placeholder={bioIsRequired ?? 'Place bio here'}
					rows={5}
					cols={35}
					name="bio"
					value={form?.success ? '' : form?.bio ?? ''}
				/>
				<input type="hidden" name="authorId" value={selectedUserId ?? ''} />
				<input type="hidden" name="bioId" value={selectedUserWithBio?.id ?? ''} />
				<button bind:this={btnCreate} type="submit" disabled={selectedUserId === ''}
					>Create Profile</button
				>
				<button bind:this={btnUpdate} type="submit" formaction="?/update" class="hidden"
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
	// .author-list {
	// 	display: flex;
	// 	align-items: baseline;
	// 	gap: 1rem;
	// }
	// .select-author {
	// 	padding-left: 2rem;
	// 	width: 15rem;
	// 	font-size: 16px;
	// 	font-weight: 300;
	// 	margin: 1rem 2.5rem 0 0;
	// 	:focus {
	// 		outline: 2px dashed red;
	// 	}
	// }

	// ul {
	// 	display: flex;
	// 	flex-direction: column;
	// 	text-align: center;
	// 	margin: 2px auto;
	// }
	textarea {
		&::placeholder {
			color: var(--PLACEHOLDER_COLOR);
			font-weight: normal;
		}
	}
</style>
