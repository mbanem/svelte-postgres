<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectBox: HTMLSelectElement;
	let selectedOptions: HTMLParagraphElement;
	let selected: string[] = [];
	const onClick = (event: MouseEvent) => {
		// const opts = Array.from(document.querySelectorAll('#categories option'));
		const opts = (event.currentTarget as HTMLSelectElement).options;
		const isSelected = (option: HTMLOptionElement) => {
			return selected.includes(option.value);
		};
		const removeSelected = (option: HTMLOptionElement) => {
			selected = selected.filter((opt) => opt !== option.value);
		};
		for (var i = 0; i < opts.length; i++) {
			if (opts[i]?.selected) {
				if (isSelected(opts[i] as HTMLOptionElement)) {
					removeSelected(opts[i] as HTMLOptionElement);
				} else {
					selected.push((opts[i] as HTMLOptionElement).value);
				}
			}
		}
		// window.ct = ct;  // use ct object in development pane
		selectedOptions.innerText = selected.length > 0 ? selected.join(', ') : 'Nothing selected';
	};
	onMount(() => {
		let options = '';
		data.categories.forEach((opt) => {
			options += '<option value="' + opt.name + '">' + opt.name + '</option>';
		});
		selectBox.innerHTML = options;
	});
</script>

<h2>Multi Select Page</h2>
<p bind:this={selectedOptions} class="selected">Nothing selected</p>
<slot {selectedOptions}>
	<select bind:this={selectBox} class="select" on:click={onClick} name="categories" multiple>
	</select>
</slot>

<style lang="scss">
	.select {
		padding: 0;
		margin: 0;
	}
	.selected {
		width: 15rem;
		height: 1.5rem;
		border: 1px solid gray;
		display: flex;
		gap: 5px;
		padding: 0;
		margin: 0;
	}
	h2 {
		color: royalblue;
		margin: 2rem auto;
		width: 30rem;
	}
</style>
