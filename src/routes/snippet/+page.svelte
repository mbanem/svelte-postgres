<script lang="ts">
	import { onMount } from 'svelte'
	import * as utils from '$utils'
	type TImage = {
		src: string
		width: number
		height: number
		caption: string
		href: string
	}
	let imgWidth = 120
	const imgWH = () => {
		const img = {
			src: `https://picsum.photos/${imgWidth}/120`,
			width: 120,
			height: 120,
			caption: 'this one does not',
			href: ''
		}
		return img as TImage
	}

	// to get different picture change width or height slightly
	let images = $state<TImage[]>([])
	// 	{
	// 		src: 'https://picsum.photos/120/120',
	// 		width: 120,
	// 		height: 120,
	// 		caption: 'this image has a link',
	// 		href: 'https://picsum.photos/121/120'
	// 	},
	// 	{
	// 		src: 'https://picsum.photos/120/121',
	// 		width: 120,
	// 		height: 120,
	// 		caption: 'this one does not',
	// 		href: ''
	// 	},
	// 	{
	// 		src: 'https://picsum.photos/122/120',
	// 		width: 120,
	// 		height: 120,
	// 		caption: 'this one does not',
	// 		href: ''
	// 	}
	// ])
	const addImage = () => {
		console.log('addImage')
		images.push(imgWH())
		imgWidth += 1
	}
	const removeImage = () => {
		console.log('removeImage')
		images = images.slice(0, -1)
		imgWidth -= 1
	}
	onMount(() => {
		// @ts-expect-error
		;[...6].forEach((_) => {
			images.push(imgWH())
			imgWidth++
		})
	})
</script>

<div class="main">
	<!-- snippet is called as a function sending it arguments
		but the caller can send thw whole object and snippet
		could be defined by destructuring elements of the
		object argument. Here @render calls figure(image)
		and snippet destructure image into its props
		src, caption, width, height
	-->
	{#snippet figure({ src, caption, width, height, href })}
		{#if href}
			<a {href}>
				<div>
					<figure>
						<img alt={caption} {src} {width} {height} />
						<figcaption>{caption}</figcaption>
					</figure>
				</div>
			</a>
		{:else}
			<div>
				<figure>
					<img alt={caption} {src} {width} {height} />
					<figcaption>{caption}</figcaption>
				</figure>
			</div>
		{/if}
	{/snippet}

	<div>
		<div class="container">
			{#each images as image}
				{@render figure(image)}
			{/each}
		</div>
	</div>
</div>
{#snippet blast()}
	<span>🇷🇸 </span>
{/snippet}
{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{#snippet countdown(n: number)}
	{#if n > 0}
		<span>{n}, </span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}
<div class="block">
	<pre>Snippet @render countdown(10)</pre>
	{@render blast()}fixed
	{@render countdown(20)}
	<div class="buttons">
		<button onclick={addImage}>add image</button>
		<button onclick={removeImage}>remove image</button>
	</div>
</div>

<style>
	body {
		position: relative;
	}
	.main {
		margin: 2rem 0 0 4rem;
	}
	.container {
		/* position: absolute; */
		/* display: flex;
		justify-content: flex-start;
		align-items: flex-start; */
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
		height: 70vh;
		width: 80vw;
		margin: 1rem 3rem 0 7rem;
		overflow: auto;
		/* padding: 4rem; */
	}
	.block {
		display: block;
		margin: 5rem 0 0 4rem;
	}
	.buttons {
		display: block;
		position: sticky;
		top: 3rem;
		left: 0rem;
		margin: 1rem 0 0 4rem;
		/* button {
			display: block;
			margin: 6px 0 0 0;
			cursor: pointer;
		} */
	}
	figure {
		background: white;
		padding: 1em;
		margin: 0 0 1em 0;
		filter: drop-shadow(2px 4px 10px rgba(0, 0, 0, 0.1));
	}

	img {
		width: 100%;
		height: auto;
		background: #eee;
	}
</style>
