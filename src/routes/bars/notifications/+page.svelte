<script lang="ts">
	import { base } from '$app/paths'
	import { browser } from '$app/environment'
	// as a sibling of root +layout.svelte it gets data by exporting data variable
	// export let data: TNotification
	import type { PageData } from './$types'

	export let data: PageData
	$: ({ notifications } = data)
</script>

{#if notifications.count > 0}
	<div class="notes">
		<p>Current World News</p>
		<ul>
			{#each notifications.items as { content }}
				<li class="content">{content}</li>
			{/each}
			<a href="{base}/"><div class="button">home</div></a>
			{#if browser}
				<div class="button" on:click={() => history.back()} aria-hidden={true}>go back</div>
			{/if}
		</ul>
	</div>
{/if}

<style lang="scss">
	.button {
		display: inline-block;
		padding: 3px 1rem;
		border: 1px solid gray;
		border-radius: 5px;
		background-color: navy;
		opacity: 0.8;
		margin-top: 2rem;
		&:hover {
			color: white;
			opacity: 1;
		}
	}
	.notes {
		border: 1px solid gray;
		border-radius: 6px;
		padding: 3px 1rem 1rem 0;
		margin: 3rem 0 0 2rem;
		font-size: 20px;
		color: lightgreen;
		p {
			margin-left: 2rem;
		}
	}
	.content {
		margin: 0 0 0.5rem 1rem;
		width: 20rem;
		font-size: 16px;
		color: skyblue;
	}
</style>
