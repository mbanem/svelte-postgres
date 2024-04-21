<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	// import { Tooltip, tooltip } from '@svelte-plugins/tooltips';
	import { Tooltip, Button } from 'flowbite-svelte';

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
		console.log('Transition ended!');
		loading = !loading;
		showTooltip = false;
	};

	const toggleStartAndLoading = () => {
		start = !start;
		loading = !loading;
		showTooltip = true;
	};
</script>

<h1>Crossfade Page</h1>
<!-- <button on:click={() => (start = !start)}>start{start}</button> -->
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
	<div class="relative">
		<p class="tooltip-base">some text with tooltip</p>
		<Tooltip placement="top" defaultClass="tooltip" arrow={false}>flowbite-svelte Tooltip</Tooltip>
	</div>
</div>

<!-- <p
	class="tooltip"
	title="{user.firstName} {user.lastName}, age {user.age}"
	action="hover"
	use:tooltip
>
	top
</p> -->
<!--
<div class="container">
	<Tooltip
		content="<b>Tooltip Top</b><p>This is an example of using the 'show' prop.</p>"
		position="top"
		animation="slide"
		bind:show={showTooltip}
		autoPosition
		arrow={false}
		action="prop"
	>
		Should show here
	</Tooltip>

	<button on:click={() => (showTooltip = true)}>Show</button>
	<button on:click={() => (showTooltip = false)}>Hide</button>
</div> -->

<p style="margin:5rem 0 0 5rem;">showTooltip {showTooltip}</p>

<style lang="scss">
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
			// border: 1px solid yellow;
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
