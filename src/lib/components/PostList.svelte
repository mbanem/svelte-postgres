<<<<<<< HEAD
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
=======
<script lang="ts">
	import { Tooltip } from 'flowbite-svelte'

	type ARGS = {
		postAuthors: PAuthor[]
		deletePost: (event: MouseEvent | KeyboardEvent, id: string) => void
		toUpdatePost: (event: MouseEvent | KeyboardEvent, id: string) => void
		selectedUserId: string
	}
	let { postAuthors, deletePost, toUpdatePost, selectedUserId }: ARGS = $props()
</script>

{#snippet tooltip(allowed: boolean, title: string)}
	<!-- NOTE the way to toggle string content based on a predicate -->
	<Tooltip
		placement="top"
		defaultClass={`tooltip_default-${allowed ? 'delete' : 'false'}`}
		arrow={false}
	>
		<p>
			{allowed ? title : 'owner only permission'}
		</p>
	</Tooltip>
{/snippet}

{#snippet item_delete(allowed: boolean, pA: PAuthor)}
	<div class="tooltip-wrapper">
		<button
			class={allowed ? 'ok-hover' : 'no-hover'}
			onclick={(event: MouseEvent | KeyboardEvent) => {
				event.preventDefault()
				allowed && deletePost(event, pA.id)
			}}
			aria-label="Delete Post"
			aria-hidden={true}
		>
			{#if allowed}
				<span style="color:red;">X</span>
			{:else}
				?
			{/if}
		</button>
		{@render tooltip(allowed, 'Delete Post')}
	</div>
{/snippet}
{#snippet item_prepare_update(allowed: boolean, pA: PAuthor)}
	<!-- NOTE: without event.preventDefault()
	 					this block could not be rendered from a snippet
						as the snippet would turn action into 'toggle completed'\
						because of the event bubling 
					-->
	<div class="tooltip-wrapper">
		<button
			class={allowed ? 'ok-hover' : 'no-hover'}
			onclick={(event: MouseEvent | KeyboardEvent) => {
				event.preventDefault()
				allowed && toUpdatePost(event, pA.id)
			}}
			aria-label="Update Post"
			aria-hidden={true}
		>
			📝
		</button>
		{@render tooltip(allowed, 'Prepare for update')}
	</div>
{/snippet}

{#snippet title_with_content(allowed: boolean, pA: PAuthor)}
	<section
		onclick={(event: MouseEvent | KeyboardEvent) => {
			event.preventDefault()
			allowed && toUpdatePost(event, pA.id)
		}}
		aria-hidden={true}
	>
		<p class={`${allowed ? 'blue' : 'gray'} ${allowed ? 'ok-hover' : 'no-hover'}`}>
			{pA.title}
		</p>
		<p>{pA.content}</p>
	</section>
{/snippet}

{#snippet info_panel(allowed: boolean, pA: PAuthor)}
	<div class="tooltip-wrapper">
		<!-- <p class="content">{pA.content}</p> -->
		{@render title_with_content(allowed, pA)}
		<Tooltip placement="top" defaultClass="tooltip_default" arrow={false}>
			<p>published</p>
			<p>{pA.published ? 'YES' : 'Not Yet'}</p>
			<p>created at</p>
			<p>{pA.createdAt.toLocaleString()}</p>
			<p>updated at</p>
			<p>{pA.updatedAt.toLocaleString()}</p>
			<p>categories</p>
			<p>{pA.categoryNames.trim()}</p>
		</Tooltip>
	</div>
{/snippet}

<!-- <pre style="font-size:11px;">postAuthors {JSON.stringify(postAuthors, null, 2)}</pre> -->
<div class="post-container">
	<ul>
		{#if postAuthors[0]}
			<p class="author_name">
				{postAuthors[0].firstName}
				{postAuthors[0].lastName}
				<span class="count">{postAuthors.length} post{postAuthors.length === 1 ? '' : 's'}</span>
			</p>

			{#each postAuthors as pA}
				{@const isOwner = pA.authorId === selectedUserId}
				<li class="post-block">
					<label>
						{@render info_panel(isOwner, pA)}
						{@render item_delete(isOwner, pA)}
						{@render item_prepare_update(isOwner, pA)}
					</label>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<!-- <pre style="font-size:11px;">postAuthors {JSON.stringify(postAuthors, null, 2)}</pre> -->

<style lang="scss">
	/* ready for app.scss */
	/* wraps title and content*/
	.tooltip-wrapper {
		position: relative;
		p {
			padding: 0 0 0 5px;
			margin: 0;
		}
		&:hover {
			cursor: pointer;
		}
	}
	// .prop-value,
	// .category-names {
	// 	display: inline-block;
	// 	width: fit-content(5rem) !important;
	// 	padding: 0;
	// 	margin: 0;
	// 	text-align: left;
	// 	border: none;
	// 	outline: none;
	// 	text-wrap: nowrap;
	// }
	// .category-names {
	// 	height: auto !important;
	// 	padding-bottom: 3px;
	// 	width: max-content;
	// 	text-wrap: wrap !important;
	// 	grid-auto-rows: minmax(4rem, auto) !important;
	// }
	/* ready for app.scss */
	:global(.tooltip_default) {
		position: absolute;
		left: 10rem !important;
		top: -4rem !important;
		display: grid;
		grid-template-columns: max-content 12rem !important;
		// grid-auto-rows: max-content !important;
		// grid-template-columns: 5rem 15rem !important;
		// row-gap: 6px;
		justify-content: flex-start;
		width: 20rem !important;
		// height: auto !important;
		color: skyblue !important;
		font-size: 14px;
		line-height: 14px;
		font-weight: 400;
		padding: 3px 1rem !important;
		text-align: left;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border: 1px solid pink !important;
		border-radius: 8px;
		z-index: 6;
		p:nth-child(even) {
			color: yellow;
			text-align: left;
			width: 15rem;
			padding: 2px 6px !important;
		}
	}

	:global(.tooltip_default-update),
	:global(.tooltip_default-delete),
	:global(.tooltip_default-false) {
		position: absolute;
		// top: -2rem !important;
		left: -2rem !important;
		width: max-content !important;
		grid-template-columns: 5rem 15rem !important;
		// height: auto !important;
		color: lightblue !important;
		border: 1px solid lightblue;
		background-color: var(--TOOLTIP-BACKGROUND-COLOR);
		border-radius: 6px;
		padding: 0 1rem;
		text-align: left;
		z-index: 6;
	}
	:global(.tooltip_default-false) {
		color: pink !important;
		border-color: pink;
	}
	.author_name {
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
	label {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		width: 100%;
		height: 100%;
	}
	.ok-hover,
	.no-hover {
		border: none; //1px solid transparent;
		outline: none;
		font-size: 20px;
		color: lightblue;
	}
	.no-hover {
		&:hover {
			// border-color: gray;
			cursor: not-allowed;
		}
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
