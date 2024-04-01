<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import CircleSpinner from '$lib/components/CircleSpinner.svelte';
	const [send, receive] = crossfade({
		duration: 2000
	});

	let foo = true;

	// function handleClick() {
	// 	foo = !foo;
	// }

	let loading = false;
	const toggleLoading = () => {
		loading = !loading;
	};
</script>

<h1>Crossfade Page</h1>
<!-- <button on:click={() => (foo = !foo)}>start{foo}</button> -->
<div class="main" on:click={() => (foo = !foo)} aria-hidden={true}>
	{#if foo}
		<div class="a" in:send={{ key: 'x' }} out:receive={{ key: 'x' }}>click me</div>
	{:else}
		<div class="b" in:send={{ key: 'x' }} out:receive={{ key: 'x' }}>and me as well</div>
	{/if}
</div>

<btton on:click={toggleLoading}>toggle loading</btton>
{#if loading}
	<CircleSpinner />
{/if}

<style lang="scss">
	.main {
		position: relative;
	}
	.a,
	.b {
		display: inline-block;
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
