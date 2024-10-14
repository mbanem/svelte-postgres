<<<<<<< HEAD
<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { crossfade } from 'svelte/transition'
	// import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$utils'
	let showTooltip = false

	let user = {
		firstName: 'Filip',
		lastName: 'Isakovic',
		age: 18
	}
	let start: boolean = true
	let [send, receive] = crossfade({
		duration: 2000
	})

	function handleClick() {
		start = !start
		showTooltip = true
	}

	let loading = false
	const toggleLoading = () => {
		loading = !loading
		showTooltip = true
		handleClick()
	}

	// unable to handle other events just on:outroend={handleEnd}
	const handleEnd = () => {
		console.log('Transition ended!')
		loading = !loading
		showTooltip = false
	}

	const toggleStartAndLoading = () => {
		start = !start
		loading = !loading
		showTooltip = true
	}
	let createdAt = new Date('2/18/2006').toLocaleString()
	let updatedAt = new Date('8/22/2007').toLocaleString()

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>CrossFade</title>
</svelte:head>

<main>
	<h1>Crossfade Page</h1>
	<div class="relative" onclick={toggleStartAndLoading} aria-hidden={true}>
		{#if start}
			<div class="a" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
				click me
			</div>
		{:else}
			<div class="b" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
				once more
			</div>
		{/if}
	</div>
	<div style="position:relative">
		<button onclick={toggleLoading} style="text-align:center;">
			<!-- {#if loading}
				<CircleSpinner color="skyblue" />
			{/if} -->
			toggle loading
		</button>
	</div>

	<div class="container">
		<div class="tooltip-wrapper">
			<p class="tooltip-base">Post content is here having a tooltip</p>
			<Tooltip placement="top" defaultClass="local-tooltip" class="local-master" arrow={false}>
				<p>created at <span class="tooltip-value">{createdAt.toLocaleString()}</span></p>
				<p>updated at <span class="tooltip-value">{createdAt.toLocaleString()}</span></p>
			</Tooltip>
		</div>
	</div>

	<p style="margin:5rem 0 0 5rem;">
		Button is flying... <span style="color:yellow;font-size:18px;">{showTooltip}</span>
	</p>
</main>

<style lang="scss">
	main {
		margin-top: 2rem;
		margin-left: 5rem;
	}

	.tooltip-value {
		color: yellow;
	}
	:global(.local-tooltip) {
		position: absolute;
		top: -4rem !important;
		left: 5rem;
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
		border: 1px solid gray;
		border-radius: 8px;
	}
	:global(.local-master) {
		color: lightgreen;
		font-size: 14px;
		font-weight: 400;
		p {
			padding: 0;
			margin: 0;
			color: skyblue;
		}
	}

	.container {
		position: absolute;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 1rem;
		top: 60vh;
		left: 20vw;
	}

	.a,
	.b {
		border: 1px solid gray;
		border-radius: 5px;
		padding: 3px 1rem;
		margin-top: 1rem;
		cursor: pointer;
		&:hover {
			color: yellow;
		}
		&:active {
			color: lightgreen;
			border: 4px solid lightgreen;
		}
		// label {
		// 	border: none;
		// 	margin: 0;
		// 	padding: 0;
		// }
	}
	.a {
		position: absolute;
		top: 2rem;
		left: 2rem;
		border: 4px solid yellow;
		display: none;
	}
	.b {
		position: absolute;
		top: 12rem;
		left: 20rem;
		border: 4px solid lightgreen;
	}
	// button {
	// 	background-color: $BACK-COLOR;
	// 	color: skyblue;
	// 	width: 10rem;
	// 	height: 2rem;
	// }
	.tooltip-base {
		display: inline-block;
		height: 0.7rem;
		line-height: 0.7rem;
		padding: 0 1rem;
		margin: 0;
	}
</style>
=======
<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { crossfade } from 'svelte/transition'
	// import CircleSpinner from '$lib/components/CircleSpinner.svelte'
	import { Tooltip } from 'flowbite-svelte'
	import * as utils from '$utils'
	let showTooltip = false

	let user = {
		firstName: 'Filip',
		lastName: 'Isakovic',
		age: 18
	}
	let start: boolean = true
	let [send, receive] = crossfade({
		duration: 2000
	})

	function handleClick() {
		start = !start
		showTooltip = true
	}

	let loading = false
	const toggleLoading = () => {
		loading = !loading
		showTooltip = true
		handleClick()
	}

	// unable to handle other events just on:outroend={handleEnd}
	const handleEnd = () => {
		console.log('Transition ended!')
		loading = !loading
		showTooltip = false
	}

	const toggleStartAndLoading = () => {
		start = !start
		loading = !loading
		showTooltip = true
	}
	let createdAt = new Date('2/18/2006').toLocaleString()
	let updatedAt = new Date('8/22/2007').toLocaleString()

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<svelte:head>
	<title>CrossFade</title>
</svelte:head>

<main>
	<h1>Crossfade Page</h1>
	<div class="relative" onclick={toggleStartAndLoading} aria-hidden={true}>
		{#if start}
			<div class="a" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
				click me
			</div>
		{:else}
			<div class="b" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} onoutroend={handleEnd}>
				once more
			</div>
		{/if}
	</div>
	<div style="position:relative">
		<button onclick={toggleLoading} style="text-align:center;">
			<!-- {#if loading}
				<CircleSpinner color="skyblue" />
			{/if} -->
			toggle loading
		</button>
	</div>
	<br style="margin-top:4rem" />
	<div class="tooltip-wrapper">
		<button style="width:100%">Post content is here having a tooltip</button>
		<Tooltip placement="top" defaultClass="local-tooltip" class="local-master" arrow={false}>
			<p>created on</p>
			<p class="prop-value">{createdAt.toLocaleString()}</p>
			<p>updated on</p>
			<p class="prop-value">{updatedAt?.toLocaleString()}</p>
		</Tooltip>
	</div>

	<p style="margin:5rem 0 0 5rem;">
		Button is flying... <span style="color:yellow;font-size:18px;">{showTooltip}</span>
	</p>
</main>

<style lang="scss">
	main {
		margin-top: 2rem;
		margin-left: 5rem;
	}

	.mp-zero {
		padding: 0;
		margin: 2px 0;
	}
	.a,
	.b {
		border: 1px solid gray;
		border-radius: 5px;
		padding: 3px 1rem;
		margin-top: 1rem;
		cursor: pointer;
		&:hover {
			color: yellow;
		}
		&:active {
			color: lightgreen;
			border: 4px solid lightgreen;
		}
	}
	.a {
		position: absolute;
		top: 2rem;
		left: 2rem;
		border: 4px solid yellow;
		display: none;
	}
	.b {
		position: absolute;
		top: 12rem;
		left: 20rem;
		border: 4px solid lightgreen;
	}
</style>
>>>>>>> bebf506 (Before moveing CSS to app.scss)
