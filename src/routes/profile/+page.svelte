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

	$: setColor(form?.message ? (form.message.includes('successfully') ? 'green' : 'red') : 'green');

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
		message = action.search === '?/create' ? 'creating profile...' : 'updating profile...';
		return async ({ update }) => {
			await update();
			ignoreFormMessage = true;

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

			setButtonVisible([btnCreate, btnUpdate]);
			clearMessage();
			invalidateAll();
			if (action.search === '?/update') {
				selectedUserWithBio.bio = bio as string;
			}
			loading = false; // stop spinner animation
		};
	};
	let adminSelected: boolean;
	let selectedUserName: string;
	onMount(() => {
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
	let bioUpdateAllowed = false;
	const canBeUpdated = (event: MouseEvent) => {
		bioUpdateAllowed = true;
		const divEl = event.currentTarget as HTMLDivElement;
		// instead of taking id easier as selectedUserWithBio?.user.id
		// we use here attribute dada-user-id as divEl.dataset.userId -- a string
		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		if (data.locals.user.id === divEl.dataset.userId) {
			bioTextArea.value = selectedUserWithBio?.bio;
			setButtonVisible([btnUpdate, btnCreate]);
		}
	};

	$: ({ users, userProfiles } = data);
	$: selectedUserWithBio = getUserWithBio(selectedUserId) as Bio;
	$: formMessage = ignoreFormMessage ? '' : form?.message || '';
	$: result = formMessage || message;
</script>

<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId
	PageName="Profile"
	user={data.locals.user}
	users={data.users}
/>
<pre style="font-size:11px;">bioUpdateAllowed {JSON.stringify(bioUpdateAllowed, null, 2)}</pre>

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
				{#if data.userProfiles[0]?.bio}
					<p class="instead-of-button" class:hidden={bioUpdateAllowed}>
						To update bio click on bio text on the right
					</p>
				{:else}
					<button
						bind:this={btnCreate}
						type="submit"
						disabled={selectedUserId === ''}
						class="button"
					>
						Create Profile
					</button>
				{/if}
				<button bind:this={btnUpdate} type="submit" formaction="?/update" class="button hidden"
					>Update Profile
				</button>
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
		.left-column {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			border: 1px solid gray;
			align-items: center;
			border-radius: 6px;
			padding-top: 1rem;
			p {
				text-align: left;
			}
			.instead-of-button {
				border: 1px solid gray;
				border-radius: 4px;
				width: 11rem;
				padding: 2px 1rem;
				text-align: center;
				margin-left: 1.7rem;
				font-size: 14px;
				user-select: none;
			}
			textarea {
				text-align: left;
				color: black;
				margin-top: 1rem;
			}
			button {
				// add margin to the class defined in styles/app.scss
				margin: 1rem 0;
			}
		}
		.right-column {
			border: 1px solid gray;
			border-radius: 6px;
			.bio {
				cursor: pointer;
			}
		}
	}
	textarea {
		&::placeholder {
			color: var(--PLACEHOLDER_COLOR);
			font-weight: normal;
		}
	}
	.hidden {
		display: none;
	}
</style>
