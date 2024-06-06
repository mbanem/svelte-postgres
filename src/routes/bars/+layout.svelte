<script lang="ts">
	import { browser } from '$app/environment'
	import type { LayoutData } from './$types'
	import NavBar from '$components/NavBar.svelte'
	import NavContainer from '$components/NavContainer.svelte'

	export let data: LayoutData

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

	$: ({ locals } = data)
</script>

<main>
	<NavContainer>
		<NavBar navButtonObjects={navButtonObjects1} role={locals?.user?.role ?? 'VISITOR'} />
		<!-- The css class nav-bar-form, defined in the <NavContainer, a component wrapper for <NavBar,
		should be wrapped by a <label> in order to make the whole form with a button responsive
		to the mouse click and for cursor the be of type pointer over the whole structure
	-->
		<label>
			<form class="nav-bar-form" method="POST" action="?/caterpillar">
				<button type="submit">caterpillar</button>
			</form>
		</label>
		<NavBar navButtonObjects={navButtonObjects2} role={locals?.user?.role ?? 'VISITOR'} />
	</NavContainer>
</main>
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->
<slot />

<style lang="scss">
	main {
		margin-top: 0.5rem;
	}
</style>
