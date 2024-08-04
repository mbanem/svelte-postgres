<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'

	type ARGS = {
		postAuthors: PAuthor[]
		deletePost: (id: string) => void
		toUpdatePost: (id: string) => void
	}
	let { postAuthors, deletePost, toUpdatePost }: ARGS = $props()
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
			{#each postAuthors as { id, title, content, published, createdAt, updatedAt, firstName, lastName, author }}
				<li class="post-block">
					<div class="title">
						<p>{title}</p>
						{#if author}
							<p onclick={() => deletePost(id)} class="highlight" aria-hidden={true}>❌</p>
							<p onclick={() => toUpdatePost(id)} class="highlight" aria-hidden={true}>📝</p>
						{/if}
					</div>
					<div class="tooltip-wrapper">
						<p class="content">{content}</p>
						<Tooltip
							placement="top"
							defaultClass="local-tooltip"
							class="local-master"
							arrow={false}
						>
							<p>published <span class="prop-value">{published ? 'yes' : 'not yet'}</span></p>
							<p>created on <span class="prop-value">{createdAt.toLocaleDateString()}</span></p>
							<p>updated on <span class="prop-value">{updatedAt.toLocaleDateString()}</span></p>
						</Tooltip>
					</div>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<!-- <pre style="font-size:11px;">postAuthors {JSON.stringify(postAuthors, null, 2)}</pre> -->

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
		text-align: left;
	}
	:global(.local-master) {
		top: -2.2rem !important;
		margin-left: calc(75% - 14rem) !important;
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
		top: -5px;
		font-style: italic;
		color: yellow;
		font-size: 16px;
		margin-bottom: 8px;
		height: 1.6rem;
		padding: 4px 1rem 0 1rem;
		background-color: black; // #3e3e3e;
		opacity: 1;
		z-index: 5;
		/*  $BACK-COLOR; */
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
