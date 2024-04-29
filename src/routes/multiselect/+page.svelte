<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SelectBox from '$lib/components/MultiSelectBox.svelte';
	import { AdvancedRating } from 'flowbite-svelte';

	export let data: PageData;

	let selectBox: HTMLSelectElement;
	let selectedOptions: HTMLParagraphElement;
	let selectedOptionsLi: HTMLParagraphElement;
	let selected: string[] = [];
	let selectedLi: string[] = [];

	const liClick = (event: MouseEvent | KeyboardEvent) => {
		const para = event.target as HTMLParagraphElement;
		const cat = para.innerText;
		const addCat = (cat: string) => {
			selectedLi.push(cat);
			para.style.color = 'tomato';
			// para.classList.add('tomato');	// does not work
		};
		const removeCat = (cat: string) => {
			selectedLi = selectedLi.filter((s) => s !== cat);
			para.style.color = 'white';
			// para.classList.remove('tomato');	// does not work
		};
		if (selectedLi.includes(cat)) {
			removeCat(cat);
		} else {
			addCat(cat);
		}
		selectedOptionsLi.innerText =
			selectedLi.length > 0 ? selectedLi.join(', ') : 'Nothing selected';
	};
	const onClick = (event: MouseEvent) => {
		const className = 'option-background';
		const select = (opt: HTMLOptionElement) => {
			selected.push(opt.value); // opt.value is text
		};
		const unselect = (opt: HTMLOptionElement) => {
			selected = selected.filter((v) => v !== opt.value);
		};
		const opt = event.target as HTMLOptionElement;
		if (opt.classList.contains(className)) {
			unselect(opt);
		} else {
			select(opt);
		}

		selectedOptions.innerText = selected.length > 0 ? selected.join(', ') : 'Nothing selected';
	};
	onMount(() => {
		let options = '';
		data.categories.forEach((opt) => {
			options += '<option value="' + opt.name + '">' + opt.name + '</option>';
		});
		selectBox.innerHTML = options;
	});
	type Category = {
		id: number | string;
		name: string;
	};
</script>

<h2>Multi Select Page</h2>
<!-- <pre style="font-size:11px;">data {JSON.stringify(data, null, 2)}</pre> -->

<SelectBox categories={data.categories} />

<slot {selectedOptions}>
	<pre>
clicking on an option toggles its selected status
and appends it to the yellow colored list
	</pre>
	<p bind:this={selectedOptions} class="selected">Nothing selected</p>
	<select
		bind:this={selectBox}
		class="select"
		on:click|preventDefault={onClick}
		name="categories"
		multiple
	>
	</select>
</slot>
<pre>
			This is a multi select box but is used here as an array list
			where clicking on an option toggles its selected status
			while the real multi select is using Ctrl+click for multi
			selection, so this behavior is not used in the app
</pre>

<p bind:this={selectedOptionsLi} class="selected-cats">Nothing selected</p>
<ul>
	{#each data.categories as category}
		<li>
			<p on:click|preventDefault={liClick}>
				{category.name}
			</p>
		</li>
	{/each}
</ul>

<style lang="scss">
	.select {
		padding: 0 5px;
		margin: 6px 0;
		background-color: cornsilk;
		border-radius: 4px;
	}
	.selected {
		width: 15rem;
		height: 1.5rem;
		border: 1px solid gray;
		display: flex;
		gap: 5px;
		line-height: 1.5rem;
		padding: 2px 10px;
		margin: 0;
		color: yellow;
	}
	.selected-cats {
		width: 25rem;
		height: 1.5rem;
		line-height: 1.5rem;
		padding: 4px 1rem;
		margin: 5px 0;
		border: 1px solid gray;
		border-radius: 5px;
		color: yellow;
	}
	h2 {
		color: royalblue;
		margin: 2rem auto;
		width: 30rem;
	}
	ul {
		list-style: none;
		border: 1px solid gray;
		border-radius: 5px;
		padding: 5px 1rem;
		margin: 0;
		height: 9rem;
		width: 8rem;
		overflow-y: auto;
		li {
			margin-bottom: 4px;
			&:first-child {
				margin-top: 5px;
			}
		}
	}
	p {
		margin: 0;
		color: $TEXT-COLOR;
		&:hover {
			color: yellow;
			cursor: pointer;
		}
	}
</style>
