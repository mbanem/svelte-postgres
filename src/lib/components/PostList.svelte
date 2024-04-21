<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	type PostList = {
		id: string;
		title: string;
		content: string;
		createdAt: Date;
		updatedAt: Date;
		firstName: string;
		lastName: string;
	};
	export let postAuthors: PostList[];
	export let deletePost: (id: string) => void;
	export let toUpdatePost: (id: string) => void;
</script>

<!-- <pre style="font-size:11px;">postAuthors {JSON.stringify(postAuthors, null, 2)}</pre> -->
<div class="post-container">
	<ul>
		{#if postAuthors[0]}
			<p class="name">
				{postAuthors[0].firstName.slice(0, -1)}
				{postAuthors[0].lastName}
				<span class="count">{postAuthors.length} post{postAuthors.length === 1 ? '' : 's'}</span>
			</p>
			{#each postAuthors as { id, title, content, createdAt, updatedAt, firstName, lastName }}
				<li class="post-block">
					<div class="title">
						<p>{title}</p>
						<p on:click={() => deletePost(id)} class="highlight" aria-hidden={true}>❌</p>
						<p on:click={() => toUpdatePost(id)} class="highlight" aria-hidden={true}>📝</p>
					</div>
					<div class="tooltip-wrapper">
						<p class="content">{content}</p>
						<Tooltip
							placement="top"
							defaultClass="local-tooltip"
							class="local-master"
							arrow={false}
						>
							<p>created on {createdAt.toLocaleDateString()}</p>
							<p>updated on {updatedAt.toLocaleDateString()}</p>
						</Tooltip>
					</div>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style lang="scss">
	.tooltip-wrapper {
		position: relative;
	}

	:global(.local-tooltip) {
		position: absolute;
		left: calc(50% - 14rem) !important;
		// top: -3rem !important;
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		border: 1px solid gray;
		border-radius: 4px;
		text-align: center;
	}
	:global(.local-master) {
		top: -2.2rem !important;
		margin-left: calc(75% - 14rem) !important;
		color: skyblue;
		font-size: 14px;
		font-weight: 400;
		p {
			padding: 0;
			margin: 0;
		}
	}
	.post-container {
		overflow-y: auto;
		width: 70vw;
		min-width: 36em;
		height: 15rem;
		border: 1px solid gray;
		border-radius: 8px;
		margin-left: 2rem;
	}
	.name {
		position: sticky;
		top: -2px;
		font-style: italic;
		color: yellow;
		font-size: 16px;
		margin-bottom: 8px;
		padding: 2px 1rem 0 1rem;
		background-color: #3e3e3e; /*  $BACK-COLOR; */
		.count {
			font-size: 12px;
			margin-left: 1.5rem;
		}
	}
	.post-block {
		list-style: none;
		margin: 0.6rem 0 0 0;
		padding: 0 5px 0 0;
	}
	.title {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		font-size: 12px;
		/* display: flex; */
		/* flex-direction: column; */
		padding: 0;
		margin: 0;
		p {
			margin: 0;
			padding: 0;
		}
	}
	.highlight:hover {
		background-color: pink;
		cursor: pointer;
	}
	.content {
		display: inline-block;
		font-size: 16px;
		font-family: Verdana, sans-serif;
		padding: 0 1rem;
		margin: 0;
	}
</style>
