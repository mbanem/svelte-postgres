<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores'; // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { setColor, setButtonVisible } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Tooltip } from 'flowbite-svelte';

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte';

	export let data: PageData;
	export let form: ActionData;

	type UserWithBio = {
		id: string;
		bio: string;
		createdAt: Date;
		updatedAt: Date;
		user: User;
	};
	let message = '';
	let bioIsRequired = '';
	// form?.message cannot be cleared by code but could be ignored when necessary
	let ignoreFormMessage = false;
	let success = '';
	let loading = false;
	let selectedUserId = '';
	let selectedUserWithBio: UserWithBio;

	let btnCreate: HTMLButtonElement;
	let btnUpdate: HTMLButtonElement;
	let btnDelete: HTMLButtonElement;
	let iconDelete: HTMLSpanElement;

	$: setColor(form?.message ? (form.message.includes('successfully') ? 'green' : 'red') : 'green');

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			message = '';
			ignoreFormMessage = false;
			result = '';
			selectedUserWithBio = getUserWithBio(selectedUserId) as UserWithBio;
		}, 2000);
	};

	const clearForm = () => {
		(document.querySelector("textarea[name='bio']") as HTMLTextAreaElement).value = '';
		setButtonVisible([btnCreate, btnUpdate]);
		// change bioId only when selectedUserId changes
		// (document.querySelector("input[name='bioId']") as HTMLInputElement).value = '';
	};
	const enhanceProfile: SubmitFunction = ({ action, formData }) => {
		console.log(action.search);
		message = '';
		bioIsRequired = '';
		ignoreFormMessage = false;
		let bio = formData.get('bio');
		if (bio === '') {
			bioIsRequired = 'Biography is required field';
			return;
		}
		loading = true; // start spinner animation
		message =
			action.search === '?/create'
				? 'creating profile...'
				: action.search === '?/update'
					? 'updating profile...'
					: 'deleting profile...';
		return async ({ update }) => {
			await update();
			ignoreFormMessage = true;

			if (action.search === '?/create') {
				message = $page.status === 200 ? 'Profile created' : 'create failed';
			} else if (action.search === '?/delete') {
				message = $page.status === 200 ? 'Profile deleted' : 'delete failed';
			} else if (action.search === '?/update') {
				message = $page.status === 200 ? 'Profile updated' : 'update failed';
			} else if (action.search === '?/delete') {
				message = $page.status === 200 ? 'Profile deleted' : 'delete failed';
				iconDelete.classList.toggle('hidden');
				setButtonVisible([btnCreate, btnUpdate]);
			}
			invalidateAll();
			loading = false; // stop spinner animation
			clearForm();
			// if (action.search === '?/update') {
			// 	selectedUserWithBio.bio = bio as string;
			// }
			// setButtonVisible([btnCreate, btnUpdate]);
			clearMessage();
		};
	};
	let adminSelected: boolean;
	let selectedUserName: string;
	onMount(() => {
		adminSelected = data.locals.user.role === 'ADMIN';
		selectedUserName = `${data.locals.user.firstName} ${data.locals.user.lastName}`;
	});

	const getUserWithBio = (id: string): UserWithBio | undefined => {
		for (let i = 0; i < userProfiles.length; i++) {
			if (userProfiles[i]?.user?.id === id) {
				// @ts-expect-error
				const { id, bio, createdAt, updatedAt, user } = data.userProfiles[i] as UserProfile;
				return { id, bio, createdAt, updatedAt, user } as UserWithBio;
			}
		}
	};

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
			iconDelete.classList.toggle('hidden');
		}
	};

	$: ({ userProfiles } = data);
	$: selectedUserWithBio = getUserWithBio(selectedUserId) as UserWithBio;
	$: formMessage = ignoreFormMessage ? '' : form?.message || '';
	$: result = message || formMessage;
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
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->

<div class="container">
	<div class="left-column">
		<div>
			User Bio
			<form action="?/create" method="post" use:enhance={enhanceProfile}>
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

				<p class="buttons">
					<button
						bind:this={btnCreate}
						type="submit"
						disabled={selectedUserId === ''}
						class="button"
					>
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						create
					</button>
					<button bind:this={btnUpdate} type="submit" formaction="?/update" class="button hidden">
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						update
					</button>
					<button on:click={clearForm}>clear</button>
				</p>
				<button bind:this={btnDelete} type="submit" formaction="?/delete" class="button hidden">
				</button>
			</form>
		</div>
	</div>
	{#if selectedUserWithBio}
		<div class="right-column">
			<p>{selectedUserWithBio.user.firstName} {selectedUserWithBio.user.lastName}</p>
			<div class="relative">
				<p
					class="bio"
					on:click={canBeUpdated}
					data-user-id={selectedUserWithBio.user.id}
					aria-hidden={true}
				>
					{selectedUserWithBio.bio ?? ''}
					<span
						bind:this={iconDelete}
						on:click={() => {
							btnDelete.click();
						}}
						aria-hidden={true}>❌</span
					>
				</p>
				<Tooltip
					placement="top"
					defaultClass="tooltip-profile"
					class="master-profile"
					arrow={false}
				>
					<p>
						created on <span class="prop-value"
							>{selectedUserWithBio.createdAt.toLocaleDateString()}</span
						>
					</p>
					<p>
						updated on <span class="prop-value"
							>{selectedUserWithBio.updatedAt.toLocaleDateString()}</span
						>
					</p>
				</Tooltip>
			</div>
		</div>
	{:else}
		<div class="right-column">There is no profile for this user</div>
	{/if}
</div>

<style lang="scss">
	.relative {
		position: relative;
	}
	:global(.tooltip-profile) {
		position: absolute;
		left: calc(100% - 14rem) !important;
		display: inline-block;
		width: 11rem !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
	}
	:global(.master-profile) {
		color: skyblue;
		font-size: 14px;
		font-weight: 400;
		p {
			display: flex;
			justify-content: space-between;
			align-content: flex-start;
			gap: 0.5rem;
			padding: 0;
			margin: 0;
			.prop-value {
				color: yellow;
			}
		}
	}
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
				width: 11.5rem;
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
				position: relative;
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
	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		width: 100%;
	}
	button {
		width: 5rem;
	}
</style>
