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
				{postAuthors[0].firstName}
				{postAuthors[0].lastName}
				<span class="count">{postAuthors.length} post{postAuthors.length === 1 ? '' : 's'}</span>
			</p>
			{#each postAuthors as { id, title, content, published, createdAt, updatedAt, author }}
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
							<p>published <span class="prop-value">{published ? 'YES' : 'Not Yet'}</span></p>
							<p>created at <span class="prop-value">{createdAt.toLocaleString()}</span></p>
							<p>updated at <span class="prop-value">{updatedAt.toLocaleString()}</span></p>
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
		.content {
			margin-left: -1rem;
			color: yellow;
		}
		p {
			width: 95%;
		}
	}

	:global(.local-tooltip) {
		position: absolute;
		color: var(-TOOLTIP-COLOR);
		top: -1.5rem !important;
		left: calc(100% - 35rem) !important;
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		border: var(--TOOLTIP-BORDER);
		border-radius: var(--TOOLTIP-BORDER-RADIUS);
		text-align: left;
		.prop-value {
			color: yellow;
		}
	}
	:global(.local-master) {
		/* master is for all tooltips but defaultClass sets CSS rules locally*/
		p {
			display: flex;
			justify-content: space-between;
			align-content: flex-start;
			gap: 0.5rem;
			/** cannot me moved to defaultClass as the default here will change padding and margin*/
			padding: 0;
			margin: 0;
		}
	}
	.post-container {
		overflow-y: auto;
		width: 40vw;
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
		color: lightgreen;
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
		margin-bottom: 1rem;
	}
	.title {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		font-size: 14px !important;
		padding: 0;
		margin: 0;
		cursor: pointer;
		p {
			font-size: 17px !important;
			margin: 0 0 5px 0;
			padding: 0;
			&:nth-child(1) {
				width: 80%;
			}
		}
	}
	.highlight {
		width: 1rem !important;
	}
	.content {
		display: inline-block;
		font-size: 20px;
		// font-family: Verdana, sans-serif;
		font-family: 'Times New Roman', Times, serif;
		font-weight: 300;
		padding: 0 1rem;
		margin: 0;
	}
</style>
