<<<<<<< HEAD
<script lang="ts">
	import { browser } from '$app/environment'
	import type { LayoutData } from './$types'
	import NavBar from '$components/NavBar.svelte'
	import NavContainer from '$components/NavContainer.svelte'
	import type { TNotification } from '$lib/types/common'
	import type { Snippet } from 'svelte'

	type ARGS = {
		locals: App.Locals
		notifications: TNotification
		children: Snippet<[]>
	}
	let { locals, notifications, children }: ARGS = $props()

	let navButtonObjects1: TNavButtonObject[] = [
		{ position: 1, title: 'font_size', href: '/font_size' }
		// { position: 0, title: 'home', href: '/' },
		// { position: 1, title: 'login', href: '/login' },
		// {
		// 	position: 2,
		// 	title: 'todo',
		// 	href: '/todo',
		// 	cssRules: '',
		// 	onHover: '',
		// 	condition: 'USER'
		// }
	]
	let navButtonObjects2: TNavButtonObject[] = [
		// { position: 4, title: 'news', href: '/news', condition: 'VISITOR' },
		{ position: 2, title: 'pavlovci', href: '/bars/pavlovci', condition: 'VISITOR' },
		{
			position: 3,
			title: 'notifications',
			href: '/bars/notifications',
			condition: 'VISITOR'
		},
		// has to be '/bars/filter' as 'bars/filter' with no forward slash will in deeper
		// level go to incorrect route
		{ position: 4, title: 'filter', href: '/bars/filter', condition: 'VISITOR' }
	]
</script>

<main>
	<NavContainer>
		<NavBar navButtonObjects={navButtonObjects1} role={locals?.user?.role ?? 'VISITOR'} />
		<!-- The css class nav-bar-form, defined in the <NavContainer, a component wrapper for <NavBar,
		should be wrapped by a <label> in order to make the whole form with a button responsive
		to the mouse click and for cursor the be of type pointer over the whole structure
	-->
		<label>
			<form class="nav-bar-form" method="POST" action="/?/register">
				<button type="submit">register</button>
			</form>
		</label>
		<NavBar navButtonObjects={navButtonObjects2} role={locals?.user?.role ?? 'VISITOR'} />
	</NavContainer>
</main>
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<pre>
		Register button is here to show using a hidden form
		with the submit button inside the navigation bar
</pre>
{@render children()}

<style lang="scss">
	main {
		margin-top: 0.5rem;
	}
</style>
=======
<script lang="ts">
	import NavBar from '$components/NavBar.svelte'
	import NavContainer from '$components/NavContainer.svelte'
	import type { TNotification } from '$lib/types/common'
	import { type Snippet } from 'svelte'
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte'

	type ARGS = {
		locals: App.Locals
		notifications: TNotification
		children: Snippet<[]>
	}
	let formModal = false
	let firstName: string, lastName: string, email: string, password: string

	let { locals, notifications, children }: ARGS = $props()

	let navButtonObjects1: TNavButtonObject[] = [
		{ position: 1, title: 'font_size', href: '/font_size', condition: 'VISITOR' },
		{ position: 2, title: 'scroll', href: '/scroll', condition: 'VISITOR' }
	]
	let navButtonObjects2: TNavButtonObject[] = [
		// { position: 4, title: 'news', href: '/news', condition: 'VISITOR' },
		{ position: 4, title: 'pavlovci', href: '/bars/pavlovci', condition: 'VISITOR' },
		{
			position: 5,
			title: 'notifications',
			href: '/bars/notifications',
			condition: 'VISITOR'
		},
		// has to be '/bars/filter' as 'bars/filter' with no forward slash will go in deeper
		// level to incorrect route
		{ position: 6, title: 'filter', href: '/bars/filter', condition: 'VISITOR' }
	]
	const getFormParams = () => {
		let params = ''
		//
		;['firstName', 'lastName', 'email', 'password'].forEach((id) => {
			const value = document.getElementById(id)
			params += `${id}=${value}&`
		})
		return params.slice(0, -1)
	}
	console.log(getFormParams())
</script>

<main>
	<NavContainer>
		<NavBar navButtonObjects={navButtonObjects1} role={locals?.user?.role ?? 'VISITOR'} />
		<!-- The css class nav-bar-form, defined in the <NavContainer, a component wrapper for <NavBar,
		should be wrapped by a <label> in order to make the whole form with a button responsive
		to the mouse click and for cursor the be of type pointer over the whole structure
	-->
		<label>
			<form class="nav-bar-form" method="GET" action="/register">
				<input id="firstName" name="firstName" value="Filip" class="hidden" />
				<input id="lastName" name="lastName" value="Isakovic" class="hidden" />
				<input id="email" name="email" value="filip@isak.com" class="hidden" />
				<input id="password" name="password" value="incorrect" class="hidden" />
				<button type="submit" formaction="/register">Register</button>
			</form>
		</label>
		<NavBar navButtonObjects={navButtonObjects2} role={locals?.user?.role ?? 'VISITOR'} />
	</NavContainer>
	<Modal bind:open={formModal} autoclose={false}>
		<form class="nav-bar-form" method="POST" action={`/register?${getFormParams()}`}>
			<!-- <form action="#"> -->
			<Input
				bind:value={firstName}
				type="text"
				name="firstName"
				id="firstName"
				placeholder="First Name"
				required
			/>
			<Input
				bind:value={lastName}
				type="text"
				name="lastName"
				id="lastName"
				placeholder="lastName"
				required
			/>
			<Input bind:value={email} type="email" name="email" id="email" placeholder="email" required />
			<Input
				bind:value={password}
				type="password"
				name="password"
				id="password"
				placeholder="password"
				required
			/>

			<!-- <button type="submit" class="bar-button">Register</button> -->
		</form>
	</Modal>
</main>
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<pre>
	This 'bars' page implements local +layout.svelte in which below the top navigatioin bar 
	it adds another navigation bar with NavContainer component.
	The NavContainer component in local +layout.svelte renders 
		1) NavBar, which gets $props() of TNavButtonObject[] array -- font_size, scroll, 
		2) next, the local +layout.svelte inserts a form method='POST' action="/register"
		with a new 'register' button to submit to the register page, and then
		3) new NavBar with TNavButtonObject[] array -- pavlovci, notifications and filter.
	So NavContainer can mix form buttons between other navigation buttons
</pre>
{@render children()}

<style lang="scss">
	main {
		margin-top: 0.5rem;
	}
	button {
		background-color: rgb(5, 5, 153) !important;
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
