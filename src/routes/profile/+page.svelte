<<<<<<< HEAD
<script lang="ts">
	import type { Snapshot } from '../$types'
	import { onMount } from 'svelte'
	import type { PageData, ActionData } from './$types'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores' // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { setColor, setButtonVisible } from '$lib/utils'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$lib/utils'

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte'

	type ARGS = {
		data: PageData
		form: ActionData
	}

	// data is refresh when form is submitted but let part = $store<TPart>(data.part) is not
	// se note at the top part of todo/+page.svelte for details
	let { data, form }: ARGS = $props()

	type UserWithBio = {
		id: string
		bio: string
		createdAt: Date
		updatedAt: Date
		user: User
	}
	type Snap = {
		bioId: string
		bio: string
		authorId: string
	}
	const initialSnap = {
		bioId: '',
		bio: '',
		authorId: ''
	}
	let snap = $state<Snap>({
		bioId: '',
		bio: '',
		authorId: ''
	})
	let bioIsRequired = ''
	// form?.message cannot be cleared by code but could be ignored when required
	let ignoreFormMessage = false
	let success = ''
	let loading = $state<boolean>(false)
	// let snap.authorId = '';

	let btnCreate: HTMLButtonElement
	let btnUpdate: HTMLButtonElement
	let btnDelete: HTMLButtonElement
	let iconDelete: HTMLSpanElement

	$effect(() =>
		setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
	)

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			ignoreFormMessage = false
			result = ''
			// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
		}, 2000)
	}

	const clearForm = () => {
		// bioTextArea.value =''	// using querySelector on attribute name and value
		;(document.querySelector("textarea[name='bio']") as HTMLTextAreaElement).value = ''
		setButtonVisible([btnCreate, btnUpdate])
		// change bioId only when snap.authorId changes
		// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
	}
	const enhanceProfile: SubmitFunction = async ({ action, formData }) => {
		if (wrongUser) {
			return
		}
		result = ''
		bioIsRequired = ''
		ignoreFormMessage = false
		let bio = formData.get('bio')
		if (bio === '') {
			bioIsRequired = 'Biography is required field'
			return
		}
		loading = true // start spinner animation
		result =
			action.search === '?/create'
				? 'creating profile...'
				: action.search === '?/update'
					? 'updating profile...'
					: 'deleting profile...'
		return async ({ update }) => {
			await update()
			ignoreFormMessage = true

			if (action.search === '?/create') {
				result = $page.status === 200 ? 'Profile created' : 'create failed'
			} else if (action.search === '?/delete') {
				result = $page.status === 200 ? 'Profile deleted' : 'delete failed'
			} else if (action.search === '?/update') {
				result = $page.status === 200 ? 'Profile updated' : 'update failed'
			} else if (action.search === '?/delete') {
				result = $page.status === 200 ? 'Profile deleted' : 'delete failed'
				iconDelete.classList.toggle('hidden')
				setButtonVisible([btnCreate, btnUpdate])
			}
			// await invalidateAll()
			loading = false // stop spinner animation
			clearForm()
			clearMessage()
		}
	}
	let adminSelected: boolean
	let selectedUserName: string

	const getUserWithBio = (id: string): UserWithBio | undefined => {
		if (bioTextArea) {
			bioTextArea.value = ''
		}

		try {
			for (let i = 0; i < data.userProfiles.length; i++) {
				if (data.userProfiles[i]?.user?.id === id) {
					const { id, bio, createdAt, updatedAt, user } = data.userProfiles[i] as UserProfile
					snap.bioId = id
					// snap.bio = bio as string;
					snap.authorId = user.id
					return { id, bio, createdAt, updatedAt, user } as UserWithBio
				}
			}
			// no profile for selected user, but they could create one so set authorId
		} catch (err) {
			console.log(err)
		}
		// utils.shallowCopy(initialSnap, snap);
	}

	// let selectedUserWithBio = $state<UserWithBio>()

	let bioTextArea: HTMLTextAreaElement
	let bioUpdateAllowed = false
	const canBeUpdated = (event: MouseEvent) => {
		// if (wrongUser) {
		// 	bioTextArea.value = '';
		// 	return;
		// }
		bioUpdateAllowed = true
		const divEl = event.currentTarget as HTMLDivElement
		if (data.locals.user.id !== divEl.dataset.userId) return
		// instead of taking id easier way as selectedUserWithBio?.user.id
		// we use here data attribute data-user-id as divEl.dataset.userId -- a string

		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		bioTextArea.value = selectedUserWithBio?.bio as string
		setButtonVisible([btnUpdate, btnCreate])
		// iconDelete.classList.toggle('hidden');
	}

	let selectedUserWithBio = $derived(getUserWithBio(snap.authorId) as UserWithBio)
	let formMessage = ignoreFormMessage ? '' : form?.message || ''
	let result = $state<string>(formMessage)
	let wrongUser = $derived(snap.authorId !== data.locals.user.id)
	$effect(() => {
		snap.bio = snap_bio
		if (selectedUserWithBio?.id) {
			setButtonVisible([btnUpdate, btnCreate])
		}
	})
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			if (value.authorId !== data.locals.user.id) {
				utils.shallowCopy(initialSnap, snap)
			} else {
				snap = value
			}
		}
	}

	// NOTE: binding sna.bio to TextArea element clears complete snap when
	// any character is entered, though there is no event listener attached to
	// so we bind dummy snap_bio and dynamically update snap.bio from it
	let snap_bio = $state<string>('')

	onMount(() => {
		// utils.shallowCopy(initialSnap, snap);
		// snap.authorId = data.locals.user.id;
		if (data.locals.user.role === 'USER') {
			if (data.userProfiles[0]) {
				utils.copyPairingAttributes(data.userProfiles[0], snap, {
					id: 'bioId',
					bio: 'bio',
					userId: 'authorId'
				})
				// snap_bio = data.userProfiles[0].bio as string;
				// snap.authorId = data.userProfiles[0].userId
				// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
			}
		}
		snap.authorId = data.locals.user.id
		adminSelected = data.locals.user.role === 'ADMIN'
		selectedUserName = `${data.locals.user.firstName} ${data.locals.user.lastName}`
		// selectedUserWithBio = getUserWithBio(data.locals.user.id) as UserWithBio

		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<!-- <pre style="font-size:14px;">selectedUserWithBio-Page {JSON.stringify(selectedUserWithBio, null, 2)}
	</pre> -->
{#snippet tooltipBio(userWithBio: UserWithBio)}
	<Tooltip placement="top" defaultClass="tooltip-profile" class="master-profile" arrow={false}>
		<p>
			created on <span class="prop-value">
				{userWithBio.createdAt.toLocaleString()}
			</span>
		</p>
		<p>
			updated on <span class="prop-value">
				{userWithBio.updatedAt.toLocaleString()}
			</span>
		</p>
	</Tooltip>
{/snippet}
{#snippet deleteIcon()}
	<Tooltip placement="top" defaultClass="tt-profile" class="m-profile" arrow={false}>
		<p>Delete the profile</p>
	</Tooltip>
{/snippet}
{#snippet ownerOnly()}
	<Tooltip placement="top" defaultClass="tt-profile" class="m-profile" arrow={false}>
		<p class="pink">Owner only permission</p>
	</Tooltip>
{/snippet}
<svelte:head>
	<title>Profile</title>
</svelte:head>

<PageTitleCombo
	PageName="Profile"
	bind:result
	bind:ignoreFormMessage
	bind:selectedUserId={snap.authorId}
	amendTrueFalseUserId={true}
	user={data.locals.user}
	users={data.users}
/>

<div class="container">
	<div class="left-column">
		<div>
			<span class="title">User Bio</span>
			<form action="?/create" method="post" use:enhance={enhanceProfile}>
				<textarea
					bind:this={bioTextArea}
					placeholder="Place bio here"
					rows={5}
					cols={35}
					name="bio"
					bind:value={snap_bio}
				></textarea>
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
						<button bind:this={btnDelete} type="submit" formaction="?/delete" class="button hidden"
						></button>
					{/if}
					<button onclick={clearForm}>clear</button>
				</p>
			</form>
		</div>
	</div>

	{#if selectedUserWithBio}
		<div class="right-column">
			<!-- <p>{selectedUserWithBio.user.firstName} {selectedUserWithBio.user.lastName}</p> -->
			<div class="relative">
				<!-- see NOTE above for data-user-id -->
				{#if wrongUser}
					<p>{selectedUserWithBio.bio ?? ''}</p>
					{@render tooltipBio(selectedUserWithBio)}

					<span class="delete-icon">X</span>
					{@render ownerOnly()}
				{:else}
					<p
						class="bio"
						onclick={canBeUpdated}
						data-user-id={selectedUserWithBio.user.id}
						aria-hidden={true}
					>
						{selectedUserWithBio.bio ?? ''}
					</p>
					{@render tooltipBio(selectedUserWithBio)}
					<span
						bind:this={iconDelete}
						onclick={() => {
							btnDelete.click()
						}}
						aria-hidden={true}><span class="delete-icon" class:pink={wrongUser}>X</span></span
					>
					{@render deleteIcon()}
				{/if}
			</div>
		</div>
	{:else}
		<div class="right-column">There is no profile for this user</div>
	{/if}
</div>

<style lang="scss">
	.relative {
		position: relative;
		p {
			cursor: default;
		}
	}
	:global(.tooltip-profile),
	:global(.tt-profile) {
		position: absolute;
		left: calc(100% - 16rem) !important;
		display: inline-block;
		width: 14rem !important;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		border: 1px solid gray;
		border-radius: 5px;
		background-color: #3e3e3e;
	}
	:global(.master-profile),
	:global(.m-profile) {
		color: skyblue;
		width: 14rem;
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
	:global(.tt-profile),
	:global(.m-profile) {
		left: calc(100% - 17rem) !important;
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

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		width: 100%;
	}

	.delete-icon {
		padding: 1px 8px 0 8px;
		outline: 1px solid tomato;
		border-radius: 4px;
		background-color: rgb(44, 111, 115);
		color: tomato;
		font-size: 20px;
		line-height: 22px;
		font-weight: 800;
		cursor: pointer;
	}
	.pink {
		color: pink !important;
		border-color: pink !important;
	}
</style>
=======
<script lang="ts">
	import type { Snapshot } from '../$types'
	import { onMount } from 'svelte'
	import type { PageData, ActionData } from './$types'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores' // for $age.status code on actions
	import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { setColor, setButtonVisible } from '$lib/utils'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$lib/utils'

	import PageTitleCombo from '$lib/components/PageTitleCombo.svelte'

	type ARGS = {
		data: PageData
		form: ActionData
	}

	// data is refresh when form is submitted but let part = $store<TPart>(data.part) is not
	// se note at the top part of todo/+page.svelte for details
	let { data, form }: ARGS = $props()

	type UserWithBio = {
		id: string
		bio: string
		createdAt: Date
		updatedAt: Date
		user: User
	}
	type Snap = {
		bioId: string
		bio: string
		authorId: string
	}
	const initialSnap = {
		bioId: '',
		bio: '',
		authorId: ''
	}
	let snap = $state<Snap>({
		bioId: '',
		bio: '',
		authorId: ''
	})
	let bioIsRequired = ''
	// form?.message cannot be cleared by code but could be ignored when required
	let ignoreFormMessage = false
	let success = ''
	let loading = $state<boolean>(false)
	// let snap.authorId = '';

	let btnCreate: HTMLButtonElement
	let btnUpdate: HTMLButtonElement
	let btnDelete: HTMLButtonElement
	let iconDelete: HTMLSpanElement

	$effect(() =>
		setColor(
			form?.message ? (form.message.includes('successfully') ? 'lightgreen' : 'pink') : 'lightgreen'
		)
	)

	// keep message displayed for several seconds
	const clearMessage = () => {
		setTimeout(() => {
			ignoreFormMessage = false
			result = ''
			// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
		}, 2000)
	}

	const clearForm = () => {
		// bioTextArea.value =''	// using querySelector on attribute name and value
		;(document.querySelector("textarea[name='bio']") as HTMLTextAreaElement).value = ''
		setButtonVisible([btnCreate, btnUpdate])
		// change bioId only when snap.authorId changes
		// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
	}
	const enhanceProfile: SubmitFunction = async ({ action, formData }) => {
		if (wrongUser) {
			return
		}
		result = ''
		bioIsRequired = ''
		ignoreFormMessage = false
		let bio = formData.get('bio')
		if (bio === '') {
			bioIsRequired = 'Biography is required field'
			return
		}
		loading = true // start spinner animation
		result =
			action.search === '?/create'
				? 'creating profile...'
				: action.search === '?/update'
					? 'updating profile...'
					: 'deleting profile...'
		return async ({ update }) => {
			await update()
			ignoreFormMessage = true

			if (action.search === '?/create') {
				result = $page.status === 200 ? 'Profile created' : 'create failed'
			} else if (action.search === '?/delete') {
				result = $page.status === 200 ? 'Profile deleted' : 'delete failed'
			} else if (action.search === '?/update') {
				result = $page.status === 200 ? 'Profile updated' : 'update failed'
			} else if (action.search === '?/delete') {
				result = $page.status === 200 ? 'Profile deleted' : 'delete failed'
				iconDelete.classList.toggle('hidden')
				setButtonVisible([btnCreate, btnUpdate])
			}
			// await invalidateAll()
			loading = false // stop spinner animation
			clearForm()
			clearMessage()
		}
	}
	let adminSelected: boolean
	let selectedUserName: string

	const getUserWithBio = (id: string): UserWithBio | undefined => {
		if (bioTextArea) {
			bioTextArea.value = ''
		}

		try {
			for (let i = 0; i < data.userProfiles.length; i++) {
				if (data.userProfiles[i]?.user?.id === id) {
					const { id, bio, createdAt, updatedAt, user } = data.userProfiles[i] as UserProfile
					snap.bioId = id
					// snap.bio = bio as string;
					snap.authorId = user.id
					return { id, bio, createdAt, updatedAt, user } as UserWithBio
				}
			}
			// no profile for selected user, but they could create one so set authorId
		} catch (err) {
			console.log(err)
		}
		// utils.shallowCopy(initialSnap, snap);
	}

	// let selectedUserWithBio = $state<UserWithBio>()

	let bioTextArea: HTMLTextAreaElement
	let bioUpdateAllowed = false
	const canBeUpdated = (event: MouseEvent) => {
		// if (wrongUser) {
		// 	bioTextArea.value = '';
		// 	return;
		// }
		bioUpdateAllowed = true
		const divEl = event.currentTarget as HTMLDivElement
		if (data.locals.user.id !== divEl.dataset.userId) return
		// instead of taking id easier way as selectedUserWithBio?.user.id
		// we use here data attribute data-user-id as divEl.dataset.userId -- a string

		// NOTE: in order to say divEl.dataset.userId HTML name must be data-user-id
		// as DOMStringMap capitalize every occurrence of dash user-new-id --> userNewId
		// console.log('user.id', user.id, 'dataset.userId', divEl.dataset.userId);
		bioTextArea.value = selectedUserWithBio?.bio as string
		setButtonVisible([btnUpdate, btnCreate])
		// iconDelete.classList.toggle('hidden');
	}

	let selectedUserWithBio = $derived(getUserWithBio(snap.authorId) as UserWithBio)
	let formMessage = ignoreFormMessage ? '' : form?.message || ''
	let result = $state<string>(formMessage)
	let wrongUser = $derived(snap.authorId !== data.locals.user.id)
	$effect(() => {
		snap.bio = snap_bio
		if (selectedUserWithBio?.id) {
			setButtonVisible([btnUpdate, btnCreate])
		}
	})
	export const snapshot: Snapshot = {
		capture: () => {
			return snap
		},
		restore: (value) => {
			if (value.authorId !== data.locals.user.id) {
				utils.shallowCopy(initialSnap, snap)
			} else {
				snap = value
			}
		}
	}

	// NOTE: binding sna.bio to TextArea element clears complete snap when
	// any character is entered, though there is no event listener attached to
	// so we bind dummy snap_bio and dynamically update snap.bio from it
	let snap_bio = $state<string>('')

	onMount(() => {
		// utils.shallowCopy(initialSnap, snap);
		// snap.authorId = data.locals.user.id;
		if (data.locals.user.role === 'USER') {
			if (data.userProfiles[0]) {
				utils.copyPairingAttributes(data.userProfiles[0], snap, {
					id: 'bioId',
					bio: 'bio',
					userId: 'authorId'
				})
				// snap_bio = data.userProfiles[0].bio as string;
				// snap.authorId = data.userProfiles[0].userId
				// selectedUserWithBio = getUserWithBio(snap.authorId) as UserWithBio
			}
		}
		snap.authorId = data.locals.user.id
		adminSelected = data.locals.user.role === 'ADMIN'
		selectedUserName = `${data.locals.user.firstName} ${data.locals.user.lastName}`
		// selectedUserWithBio = getUserWithBio(data.locals.user.id) as UserWithBio

		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<!-- <pre style="font-size:14px;">selectedUserWithBio-Page {JSON.stringify(selectedUserWithBio, null, 2)}
	</pre> -->
{#snippet tooltipBio(userWithBio: UserWithBio)}
	<Tooltip placement="top" defaultClass="tooltip-profile" class="master-profile" arrow={false}>
		<p>
			<span style="color:lightgreen;margin:0 1rem 0 0;"> created at</span>
			<span class="property-value">
				{userWithBio.createdAt.toLocaleString()}
			</span>
		</p>
		<p>
			<span style="color:lightgreen;margin:0 1rem 0 0;"> udated at</span>
			<span class="property-value">
				{userWithBio.updatedAt.toLocaleString()}
			</span>
		</p>
	</Tooltip>
{/snippet}
{#snippet deleteIcon()}
	<Tooltip placement="top" defaultClass="tooltip-label" class="tooltip-profile" arrow={false}>
		<p>delete the profile</p>
	</Tooltip>
{/snippet}
{#snippet ownerOnly()}
	<Tooltip placement="top" defaultClass="tooltip-label" class="tooltip-profile" arrow={false}>
		<p class="pink">Owner only permission</p>
	</Tooltip>
{/snippet}
<svelte:head>
	<title>Profile</title>
</svelte:head>

<PageTitleCombo
	PageName="Profile"
	bind:result
	bind:ignoreFormMessage
	bind:selectedUserId={snap.authorId}
	amendTrueFalseUserId={true}
	user={data.locals.user}
	users={data.users}
/>

<div class="container">
	<div class="left-column">
		<div>
			<span class="title">User Bio</span>
			<form action="?/create" method="post" use:enhance={enhanceProfile}>
				<textarea
					bind:this={bioTextArea}
					placeholder="Place bio here"
					rows={5}
					cols={35}
					name="bio"
					bind:value={snap_bio}
				></textarea>
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
						<button bind:this={btnDelete} type="submit" formaction="?/delete" class="button hidden"
						></button>
					{/if}
					<button onclick={clearForm}>clear</button>
				</p>
			</form>
		</div>
	</div>

	{#if selectedUserWithBio}
		<div class="right-column">
			<!-- <p>{selectedUserWithBio.user.firstName} {selectedUserWithBio.user.lastName}</p> -->
			<div class="relative">
				<!-- see NOTE above for data-user-id -->
				{#if wrongUser}
					<p>{selectedUserWithBio.bio ?? ''}</p>
					{@render tooltipBio(selectedUserWithBio)}

					<span class="icon-delete">X</span>
					{@render ownerOnly()}
				{:else}
					<p
						class="bio"
						onclick={canBeUpdated}
						data-user-id={selectedUserWithBio.user.id}
						aria-hidden={true}
					>
						{selectedUserWithBio.bio ?? ''}
					</p>
					{@render tooltipBio(selectedUserWithBio)}
					<span
						bind:this={iconDelete}
						onclick={() => {
							btnDelete.click()
						}}
						aria-hidden={true}><span class="icon-delete" class:pink={wrongUser}>X</span></span
					>
					{@render deleteIcon()}
				{/if}
			</div>
		</div>
	{:else}
		<div class="right-column">There is no profile for this user</div>
	{/if}
</div>

<style lang="scss">
	.relative {
		p {
			cursor: default;
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
		}
		.right-column {
			position: relative;
			border: 1px solid gray;
			border-radius: 6px;
			padding: 2rem 8px 1rem 1rem;
			overflow-y: auto;
			.bio {
				cursor: pointer;
			}
		}
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		width: 100%;
	}

	.pink {
		color: pink !important;
		border-color: pink !important;
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
