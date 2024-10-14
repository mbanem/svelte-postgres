<script lang="ts">
	import { onMount, tick } from 'svelte'
	import * as utils from '$utils'
	let divEl: HTMLDivElement
	type TImage = {
		src: string
		width: number
		height: number
		caption: string
		href: string
		alt: string
	}
	let imgWidth = 120
	const imgWH = () => {
		const id = utils.id()
		const img = {
			src: `https://picsum.photos/${imgWidth}/120`,
			width: 120,
			height: 120,
			caption: id,
			href: '',
			alt: id
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
		scroll()
	}
	const removeImage = () => {
		console.log('removeImage')
		images = images.slice(0, -1)
		imgWidth -= 1
		scroll()
	}
	const deleteImg = (event: MouseEvent) => {
		// @ts-expect-error
		const image = event.target as TImage
		images = images.filter((img) => img.alt !== image.alt)
		scroll()
	}

	const scroll = () => {
		// console.log(divEl.offsetHeight, divEl.scrollTop, divEl.getBoundingClientRect().height)
		// height - 20 is to react properly to scroll
		if (divEl.offsetHeight + divEl.scrollTop > divEl.getBoundingClientRect().height - 20) {
			tick().then(() => {
				divEl.scrollTo(0, divEl.scrollHeight)
			})
		}
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
	{#snippet countdown(n: number)}
		{#if n > 0}
			<span>{n}, </span>
			{@render countdown(n - 1)}
		{:else}
			{@render blastoff()}
		{/if}
	{/snippet}
	<div class="block">
		<pre>Snippet @render countdown(20)</pre>
		{@render blast()}fixed
		{@render countdown(20)}
		<div class="buttons">
			<button onclick={addImage}>add image</button>
			<button onclick={removeImage}>remove last</button>
			<pre>click on an image to remove it</pre>
		</div>
	</div>
	<!-- snippet is called as a function sending it arguments
		but the caller can send thw whole object and snippet
		could be defined by destructuring elements of the
		object argument. Here @render calls figure(image)
		and snippet destructure image into its props
		src, caption, width, height
	-->
	{#snippet figure({ src, caption, width, height, href }: TImage)}
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
		<div bind:this={divEl} class="container" onclick={deleteImg} aria-hidden={true}>
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

<style>
	.main {
		margin: 0 0 0 4rem;
	}
	.container {
		/* position: absolute; */
		/* display: flex;
		justify-content: flex-start;
		align-items: flex-start; */
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		row-gap: px;
		column-gap: 1rem;
		height: 75vh;
		width: 80vw;
		margin: 0 3rem 0 7rem;
		overflow: auto;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 1rem;
		/* padding: 4rem; */
	}
	.block {
		display: block;
		margin: 1rem 0 0 4rem;
	}
	.buttons {
		display: block;
		position: sticky;
		top: 0;
		left: 0;
		margin: 0 0 1rem 4rem;
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
		cursor: pointer;
	}
	pre {
		display: inline-block;
		margin-left: 4rem;
		margin-right: 3rem;
		padding: 0;
	}
</style>
