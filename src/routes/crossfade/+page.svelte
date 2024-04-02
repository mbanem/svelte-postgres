<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import { tick } from 'svelte';
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	import { onMount } from 'svelte';
	let start: boolean = true;
	let [send, receive] = crossfade({
		duration: 2
	});

	// function handleClick() {
	// 	start = !start;
	// }

	let loading = false;
	const toggleLoading = () => {
		loading = !loading;
	};

	const handleStart = () => {
		console.log('Transition started!');
	};

	const handleEnd = () => {
		console.log('Transition ended!');
	};

	onMount(async () => {
		start = false;
		// just
		await tick();
		[send, receive] = crossfade({
			duration: 2000
		});
		start = true;
		// setTimeout(() => {
		// 	start = true;
		// }, 0);
	});
</script>

<h1>Crossfade Page</h1>
<!-- <button on:click={() => (start = !start)}>start{start}</button> -->
<div class="main" on:click={() => (start = !start)} aria-hidden={true}>
	{#if start}
		<div
			class="a"
			in:send={{ key: 'x' }}
			out:receive={{ key: 'x' }}
			on:introstart={handleStart}
			on:outroend={handleEnd}
		>
			click me
		</div>
	{:else}
		<div
			class="b"
			in:send={{ key: 'x' }}
			out:receive={{ key: 'x' }}
			on:introstart={handleStart}
			on:outroend={handleEnd}
		>
			once more
		</div>
	{/if}
</div>

<button on:click={toggleLoading} style="text-align:center;position:relative;">
	{#if loading}
		<CircleSpinner />
	{/if}
	toggle loading
</button>

<!-- <button type="submit">
	{#if loading}
		<Spinner size={4} color="green" />
	{/if}
	save
</button> -->

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
			border: 1px solid yellow;
			color: yellow;
		}
		&:active {
			color: lightgreen;
		}
	}
	.a {
		position: absolute;
		top: 2rem;
		left: 2rem;
	}
	.b {
		position: absolute;
		top: 12rem;
		left: 30rem;
	}
</style>
