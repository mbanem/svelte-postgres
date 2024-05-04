<script lang="ts">
	import type { Snapshot } from '../$types';
	import { onMount, getContext } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores'; // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { setColor, setButtonVisible } from '$lib/utils';
	import { Checkbox, P, Tooltip } from 'flowbite-svelte';
	import * as utils from '$lib/utils';

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

	const initialSnap = {
		bioId: '',
		bio: '',
		authorId: ''
	};
	let snap = {
		bioId: '',
		bio: '',
		authorId: ''
	};
	let message = '';
	let bioIsRequired = '';
	// form?.message cannot be cleared by code but could be ignored when required
	let ignoreFormMessage = false;
	let success = '';
	let loading = false;
	// let snap.authorId = '';
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
			selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio;
		}, 2000);
	};

	const clearForm = () => {
		// bioTextArea.value =''	// using querySelector on attribute name and value
		(document.querySelector("textarea[name='bio']") as HTMLTextAreaElement).value = '';
		setButtonVisible([btnCreate, btnUpdate]);
		// change bioId only when snap.authorId changes
	};
	const enhanceProfile: SubmitFunction = ({ action, formData }) => {
		if (wrongUser) {
			return;
		}
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
			clearMessage();
		};
	};
	let adminSelected: boolean;
	let selectedUserName: string;

	const getUserWithBio = (id: string): UserWithBio | undefined => {
		if (bioTextArea) {
			bioTextArea.value = '';
		}

		try {
			for (let i = 0; i < data.userProfiles.length; i++) {
				if (data.userProfiles[i]?.user?.id === id) {
					// @ts-expect-error
					const { id, bio, createdAt, updatedAt, user } = data.userProfiles[i] as UserProfile;
					snap.bioId = id;
					// snap.bio = bio as string;
					snap.authorId = user.id;
					return { id, bio, createdAt, updatedAt, user } as UserWithBio;
				}
			}
			// no profile for selected user, but they could create one so set authorId
		} catch (err) {
			console.log(err);
		}
		// utils.shallowCopy(initialSnap, snap);
	};

	let bioTextArea: HTMLTextAreaElement;
	let bioUpdateAllowed = false;
	const canBeUpdated = (event: MouseEvent) => {
		// if (wrongUser) {
		// 	bioTextArea.value = '';
		// 	return;
		// }
		bioUpdateAllowed = true;
		const divEl = event.currentTarget as HTMLDivElement;
		if (data.locals.user.id !== divEl.dataset.userId) return;
		// instead of taking id easier way as selectedUserWithBio?.user.id
		// we use here data attribute data-user-id as divEl.dataset.userId -- a string

		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		bioTextArea.value = selectedUserWithBio?.bio;
		setButtonVisible([btnUpdate, btnCreate]);
		// iconDelete.classList.toggle('hidden');
	};

	let wrongUser: boolean = false;
	$: ({ userProfiles } = data);
	// $: selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio;
	$: formMessage = ignoreFormMessage ? '' : form?.message || '';
	$: result = message || formMessage;
	$: snap.bio = snap_bio;
	$: wrongUser = snap.authorId !== data.locals.user.id;
	$: if (selectedUserWithBio?.id) {
		setButtonVisible([btnUpdate, btnCreate]);
	}
	export const snapshot: Snapshot = {
		capture: () => {
			return snap;
		},
		restore: (value) => {
			if (value.authorId !== data.locals.user.id) {
				utils.shallowCopy(initialSnap, snap);
			} else {
				snap = value;
			}
		}
	};
	let mrPath = getContext('mrPath') as SvelteStore<string>;

	// NOTE: binding sna.bio to TextArea element clears complete snap when
	// any character is entered, though there is no event listener attached to
	// so we bind dummy snap_bio and dynamically update snap.bio from it
	let snap_bio = '';

	onMount(() => {
		// utils.shallowCopy(initialSnap, snap);
		// snap.authorId = data.locals.user.id;
		if (data.locals.user.role === 'USER') {
			if (data.userProfiles[0]) {
				utils.copyPairingAttributes(data.userProfiles[0], snap, {
					id: 'bioId',
					bio: 'bio',
					userId: 'authorId'
				});
				// snap_bio = data.userProfiles[0].bio as string;
				snap.authorId = data.userProfiles[0].userId;
				selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio;
			}
		}
		// snap.authorId = data.locals.user.id;
		adminSelected = data.locals.user.role === 'ADMIN';
		selectedUserName = `${data.locals.user.firstName} ${data.locals.user.lastName}`;
		return () => {
			// @ts-expect-error
			mrPath.set($page.url.pathname);
		};
	});
</script>

{#key snap.authorId}
	<p>wrongUser {wrongUser}</p>
{/key}
<!-- <pre>
	snap.authorId {snap.authorId}
	{data.locals.user.id}
	{snap.authorId !== data.locals.user.id}
</pre>
<pre style="font-size:11px;">selectedUserWithBio {JSON.stringify(
		selectedUserWithBio,
		null,
		2
	)}</pre> -->
<svelte:head>
	<title>Profile</title>
</svelte:head>

<PageTitleCombo
	bind:result
	bind:message
	bind:ignoreFormMessage
	bind:selectedUserId={snap.authorId}
	PageName="Profile"
	user={data.locals.user}
	users={data.users}
/>
<!-- <pre style="font-size:11px;">snap {JSON.stringify(snap, null, 2)}</pre> -->

<div class="container">
	<div class="left-column">
		<div>
			<span class="title">User Bio</span>
			<form action="?/create" method="post" use:enhance={enhanceProfile}>
				<textarea
					bind:this={bioTextArea}
					class="text-area"
					placeholder={bioIsRequired ?? 'Place bio here'}
					rows={5}
					cols={35}
					name="bio"
					bind:value={snap_bio}
				/>
				<input type="hidden" name="authorId" bind:value={snap.authorId} />
				<input type="hidden" name="bioId" bind:value={snap.bioId} />

				<p class="buttons">
					<button bind:this={btnCreate} type="submit" disabled={!snap.authorId} class="button">
						{#if loading}
							<CircleSpinner color="skyblue" />
						{/if}
						create
					</button>
					{#if !wrongUser}
						<button bind:this={btnUpdate} type="submit" formaction="?/update" class="button hidden">
							{#if loading}
								<CircleSpinner color="skyblue" />
							{/if}
							update
						</button>
						<button
							bind:this={btnDelete}
							type="submit"
							formaction="?/delete"
							class="button hidden"
						/>
					{/if}
					<button on:click={clearForm}>clear</button>
				</p>
			</form>
		</div>
	</div>
	{#if selectedUserWithBio}
		<div class="right-column">
			<p>{selectedUserWithBio.user.firstName} {selectedUserWithBio.user.lastName}</p>
			<div class="relative">
				<!-- see NOTE above for data-user-id -->
				{#if !wrongUser}
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
				{:else}
					{selectedUserWithBio.bio ?? ''}
					<span
						bind:this={iconDelete}
						on:click={() => {
							btnDelete.click();
						}}
						aria-hidden={true}>❌</span
					>
				{/if}
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
		height: 70vh;
		grid-template-columns: 1fr 1fr;
		text-align: center;
		.left-column {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: stretch;
			border: 1px solid gray;
			align-items: center;
			border-radius: 6px;
			padding-top: 1rem;
			p {
				text-align: left;
				flex: 1;
			}
			.title {
				color: skyblue;
				font-size: 20px;
			}
			textarea {
				width: 33rem;
				height: 23rem;
				text-align: left;
				color: black;
				margin-top: 1rem;
				overflow-y: auto;
			}
			button {
				position: relative;
				// add margin to the class defined in app-wide styles/app.scss
				margin: 1rem 0;
			}
		}
		.right-column {
			border: 1px solid gray;
			border-radius: 6px;
			padding: 2rem 8px 1rem 1rem;
			overflow-y: auto;
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
