<script lang="ts">
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	const [send, receive] = crossfade({});

	let left = ['red', 'orange', 'green', 'purple'];
	let right = ['yellow', 'blue'];

	const move = (item: string, from: string[], to: string[]) => {
		to.push(item);
		return [from.filter((i) => i !== item), to];
	};

	const moveLeft = (item: string) => {
		[right, left] = move(item, right, left);
	};

	const moveRight = (item: string) => {
		[left, right] = move(item, left, right);
		console;
	};
</script>

<main class="main-class">
	<p>Click a button to move it to the opposite list.</p>
	<div class="grid-block">
		<div class="list">
			{#each left as item (item)}
				<button
					animate:flip
					in:receive={{ key: item }}
					out:send={{ key: item }}
					on:click={() => moveRight(item)}
					style:background-color={item}
					style:color={item === 'yellow' ? 'black' : 'white'}
					style="font-weight:700;"
				>
					{item}
				</button>
			{/each}
		</div>

		<div class="list">
			{#each right as item (item)}
				<button
					animate:flip
					in:receive={{ key: item }}
					out:send={{ key: item }}
					on:click={() => moveLeft(item)}
					style:background-color={item}
					style:color={item === 'yellow' ? 'black' : 'white'}
					style:opacity={0.5}
				>
					{item}
				</button>
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	.main-class {
		border: 1px solid gray;
		border-radius: 8px;
		width: 20rem;
		margin: 0 auto;
		margin-top: 3rem;
		text-align: center;
	}
	.grid-block {
		display: grid;
		margin: 0 auto;
		margin-left: 4rem;
		grid-template-columns: 1fr 1fr;
	}
	button {
		background-color: cornflowerblue;
		border: none;
		color: white;
		padding: 10px;
		margin-bottom: 10px;
		width: 5rem;
		text-align: center !important;
	}

	.list {
		display: inline-block;
		margin-right: 30px;
		vertical-align: top;
		width: 70px;
	}
</style>
