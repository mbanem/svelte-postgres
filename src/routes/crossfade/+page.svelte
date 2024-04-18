<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	let start: boolean = true;
	let [send, receive] = crossfade({
		duration: 2000
	});

	function handleClick() {
		start = !start;
	}

	let loading = false;
	const toggleLoading = () => {
		loading = !loading;
		handleClick();
	};

	// unable to handle other events just on:outroend={handleEnd}
	const handleEnd = () => {
		console.log('Transition ended!');
		loading = !loading;
	};

	const toggleStartAndLoading = () => {
		start = !start;
		loading = !loading;
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
			<CircleSpinner color="yellow" />
		{/if}
		toggle loading
	</button>
</div>

<style lang="scss">
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
</style>
