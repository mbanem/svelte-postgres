<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';

	export const getSelectedCategoryIDs = (): string => {
		const values = Array.from(document.querySelectorAll('#selBox option:checked')).map((el) => {
			// @ts-expect-error
			return el.value;
		});
		return values.join(',');
	};
	// data contains all category options including selected flag
	export let data: PageData;

	export const setSelectedOptions = (arr: number[], _: string) => {
		// arr: selected category ids 1-based instead of zero-based arrays
		const selectBox = document.getElementById('selBox') as HTMLSelectElement;
		const options = selectBox.options as HTMLOptionsCollection;

		// clear all selections
		for (let i = 0; i < options.length; i++) {
			(options[i] as HTMLOptionElement).selected = false;
		}
		const selectedNames: string[] = [];
		// categoryIds count from 1 but options from zero, so ix - 1
		arr.forEach((ix) => {
			// arr contains all SELECTED options so we set selected = true for every arr entry
			(options[ix - 1] as HTMLOptionElement).selected = true;
			// we render selected names above the select box so we make a list
			// @ts-expect-error
			selectedNames.push(data[ix - 1].name);
		});

		// we place CSV string in selectedOptions HTML paragraph element
		selectedOptions.innerText = selectedNames.join(', ');
		selectBox.focus();
	};
	export let categoryIsRequired = 'Please select corresponding categories';

	let selected: { value: number; text: string }[] = [];
	const onChange = () => {
		// querySelectorAll can get all selected options so we map them in an array of {value:number, text:string}
		selected = Array.from(document.querySelectorAll('#selBox option:checked')).map((el) => {
			// @ts-expect-error
			return { value: el.value, text: el.text };
		});

		// we place CSV string in selectedOptions HTML paragraph element
		selectedOptions.innerText =
			selected.length > 0 ? selected.map((el) => el.text).join(', ') : categoryIsRequired;
	};

	let selectedOptions: HTMLParagraphElement;
	onMount(() => {
		let options = '';
		let selectedCats = '';
		// data contains all category options including selected flag
		// so we prepare HTML string for selectBox <options> elements
		data.categories.forEach((opt) => {
			options += '<option id="' + opt.id + '" value="' + opt.id + '">' + opt.name + '</option>';
		});
		const selectBox = document.getElementById('selBox') as HTMLSelectElement;
		// now we build options from prepared HTML string options
		selectBox.innerHTML = options;
		selectBox.selectedIndex = -1; // select nothing
		selectedOptions.innerText = categoryIsRequired;
	});

	$: color = categoryIsRequired === 'Category is required' ? 'red' : 'skyblue';
</script>

<svelte:head>
	<title>SelectBox</title>
</svelte:head>

<h1 style="color:lightgreen;font-weight:400;">SelectBox Page</h1>
<!-- <pre style="font-size:11px;">categories {JSON.stringify(data, null, 2)}</pre> -->

<div>
	<p style:color bind:this={selectedOptions}>
		{categoryIsRequired}
	</p>
	<select id="selBox" on:change={onChange} name="categories" multiple> </select>
</div>
