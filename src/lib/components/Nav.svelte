<script lang="ts">
	export let locals: App.Locals;
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import Links from './Links.svelte';
	import { capitalize } from '$lib/utils';

	// when user leave partially or fully loaded page
	// we save its path into the previousPath store and
	// if user clicks on the button to turn back we
	// use history.back() instead of the url as that way
	// the page data would be preserved
	let mrPath = getContext('mrPath') as SvelteStore<string>;
	$: prevPath = $mrPath;
	const followPath = (path: string) => {
		if (path === prevPath.slice(1)) {
			history.back();
		} else {
			path === 'home' ? goto('/') : goto(`/${path}`);
		}
	};
</script>

<nav>
	<a href="/" data-sveltekit-preload-data="tap">Home</a>
	{#if locals?.user}
		<!-- <a href="/post">new post</a>
		<a href="/profile">new profile</a>
		<a href="/todo">todos</a> -->
		<Links paths={['home', 'post', 'profile', 'todo']} {prevPath} />
		<!--
			in order to call /logout/+page.server.ts
			default action we need a form with action ='/logout'
			that we can call from any page across the app,
			while action='?/logout' is if we have a sibling server.ts
			that exports action names -- prefixed by question mark ?
			e.gc. export const actions: Actions = {
				logout:				-- which we target as .?/logout
		-->
		<form method="POST" action="/logout">
			<button type="submit" class="logout">log out</button>
		</form>
		{#if locals.user.role === 'ADMIN'}
			<!-- <a href="/admin">admin</a>
			<a href="/users">user list</a> -->
			<Links paths={['admin', 'users']} {prevPath} />
		{/if}let ButtonProps1: TButtonProps = ['HOME', 'post', 'profile', 'todo', 'news'] let
		ButtonProps2: TButtonProps = [ 'admin', 'users', ['notifications', '/about/notifications'],
		['pavlovci', '/about/pavlovci'] ]
	{:else}
		<!-- <a href="/login">login</a>
		<a href="/register">register</a> -->
		<Links paths={['login', 'register']} {prevPath} />
	{/if}
	<!-- <a href="/crossfade">crossfade</a>
	<a href="/flip">FLIP</a>
	<a href="/multiselect">multi select</a>
	<a href="/box">Box</a>
	<a href="/communicate">communicate</a> -->
	<Links paths={['flip', 'multiselect', 'box', 'communicate']} {prevPath} />
	<p>{capitalize($mrPath)}</p>
</nav>

<style lang="scss">
	nav {
		display: flex;
		justify-content: left;
		text-align: center;
		gap: 0;
		width: 90vw;
		height: 1.8rem;
		a:any-link,
		form button {
			display: inline-block;
			width: 6rem;
			padding: 4px 0;
			border: $BORDER;
			border-radius: $BORDER-RADIUS;
			text-decoration: none;
			color: $LINK-COLOR;
			opacity: 0.7;
			background-color: $BACK-COLOR;
			// text-wrap: nowrap;
			&:hover {
				background-color: $BACK-COLOR;
				color: $LINK-HOVER;
				border: $BORDER-HOVER;
				border-radius: $BORDER-RADIUS;
				opacity: 1;
			}
		}
	}
</style>
