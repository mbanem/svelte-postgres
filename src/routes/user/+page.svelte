<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import * as utils from '$utils'

	export let data: PageData
	$: ({ user } = data)

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>User</title>
</svelte:head>

<!-- <pre style="font-size:10px;"> {JSON.stringify(data, null, 2)}</pre> -->
<div class="container">
	{#if user}
		<p class="name">{user.firstName} {user.lastName}</p>
		<p class="email">email {user.email}</p>
		<a class="link-button" href="/users">back to user list</a>
		<div class="user-includes">
			<p>Profile</p>
			<p>{user?.profile?.bio}</p>
		</div>
		<div class="user-includes">
			<p>Posts</p>
			{#each user?.posts as { title, content }, index}
				<p>{index + 1} {title}</p>
				<p style="padding-left:1rem;">{content}</p>
			{/each}
		</div>
		<div class="user-includes">
			<p>Articles</p>
			{#each user?.articles as { title, content }}
				<p>{title}</p>
				<p>{content}</p>
			{/each}
		</div>
	{/if}
</div>

<!-- <pre style="font-size:11px;"> {JSON.stringify(data, null, 2)}</pre> -->

<style lang="scss">
	.name {
		font-size: 25px;
		color: yellow;
	}
	.email {
		display: inline-block;
		color: rgb(136, 194, 244);
		font-size: 18px;
		font-style: italic;
		cursor: not-allowed;
	}

	.user-includes {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-height: 13.8rem;
		margin-top: 1.5rem 0;
		width: 40rem;
		padding: 5px 0 10px 1rem;
		overflow-y: auto;
		p {
			padding: 0;
			margin: 4px 0 0 0;
			&:nth-child(1) {
				margin: 0;
				color: yellow;
			}
		}
	}
	a:any-link {
		color: var(--LINK-COLOR);
	}
	a:hover,
	a:focus-visible {
		color: rgb(136, 194, 244);
	}
	a:active {
		color: var(--LINK-ACTIVE);
	}
	.link-button {
		display: inline-block;
		width: 9rem;
		height: 1rem;
		background: rgb(86, 75, 75);
		padding: 4px 10px;
		text-align: center;
		border: 1px solid gray;
		border-radius: 5px;
		color: white;
		font-weight: 400;
		line-height: 1rem;
		margin-left: 4rem;
	}
</style>
