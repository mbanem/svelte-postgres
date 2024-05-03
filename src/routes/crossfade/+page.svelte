<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, getContext } from 'svelte';
	import { crossfade } from 'svelte/transition';
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { Tooltip } from 'flowbite-svelte';

	let showTooltip = false;

	let user = {
		firstName: 'Filip',
		lastName: 'Isakovic',
		age: 18
	};
	let start: boolean = true;
	let [send, receive] = crossfade({
		duration: 2000
	});

	function handleClick() {
		start = !start;
		showTooltip = true;
	}

	let loading = false;
	const toggleLoading = () => {
		loading = !loading;
		showTooltip = true;
		handleClick();
	};

	// unable to handle other events just on:outroend={handleEnd}
	const handleEnd = () => {
		// console.log('Transition ended!');
		loading = !loading;
		showTooltip = false;
	};

	const toggleStartAndLoading = () => {
		start = !start;
		loading = !loading;
		showTooltip = true;
	};
	let createdAt = new Date('2/18/2006').toLocaleDateString();
	let updatedAt = new Date('8/22/2007').toLocaleDateString();

	let mrPath = getContext('mrPath') as SvelteStore<string>;

	onMount(() => {
		return () => {
			mrPath.set($page.url.pathname);
		};
	});
</script>

<svelte:head>
	<title>CrossFade</title>
</svelte:head>

<h1>Crossfade Page</h1>
<div class="main" on:click={toggleStartAndLoading} aria-hidden={true}>
	{#if start}
		<div class="a" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} on:outroend={handleEnd}>
			click me
		</div>
	{:else}
		<div class="b" in:send={{ key: 'x' }} out:receive={{ key: 'x' }} on:outroend={handleEnd}>
			once more
		</div>
	{/if}
</div>
<div style="position:relative">
	<button on:click={toggleLoading} style="text-align:center;">
		{#if loading}
			<CircleSpinner color="skyblue" />
		{/if}
		toggle loading
	</button>
</div>

<div class="container">
	<div class="tooltip-wrapper">
		<p class="tooltip-base">Post content is here</p>
		<Tooltip placement="top" defaultClass="local-tooltip" class="local-master" arrow={false}>
			<p>created on {createdAt}</p>
			<p>updated on {updatedAt}</p>
		</Tooltip>
	</div>
</div>

<p style="margin:5rem 0 0 5rem;">showTooltip {showTooltip}</p>

<style lang="scss">
	.tooltip-wrapper {
		position: relative;
	}

	:global(.local-tooltip) {
		position: absolute;
		top: -1rem;
		left: 0;
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		padding: 3px 1rem;
		text-align: center;
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
		top: 50vh;
		left: 20vw;
	}
	.main {
		position: relative;
	}
	.a,
	.b {
		border: 1px solid gray;
		border-radius: 5px;
		padding: 3px 1rem;
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
	}
	.b {
		position: absolute;
		top: 12rem;
		left: 20rem;
		border: 4px solid lightgreen;
	}
	button {
		background-color: $BACK-COLOR;
		color: skyblue;
		width: 10rem;
		height: 2rem;
	}
	.tooltip-base {
		display: inline-block;
		height: 0.7rem;
		line-height: 0.7rem;
		padding: 0 1rem;
		margin: 0;
	}
</style>
