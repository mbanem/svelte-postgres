<script lang="ts">
	import { onMount } from 'svelte';

	export const getSelectedCategoryIDs = (): string => {
		const values = Array.from(document.querySelectorAll('#selBox option:checked')).map((el) => {
			// @ts-expect-error
			return el.value;
		});
		return values.join(',');
	};
	export let data: { id: number; name: string; selected?: boolean }[];

	export const setSelectedIds = (arr: number[]) => {
		const selectBox = document.getElementById('selBox') as HTMLSelectElement;
		const options = selectBox.options as HTMLOptionsCollection;
		for (let i = 0; i < options.length; i++) {
			(options[i] as HTMLOptionElement).selected = false;
		}
		selectBox.selectedIndex = -1;
		const selectedNames: string[] = [];
		arr.forEach((ix) => {
			(options[ix - 1] as HTMLOptionElement).selected = true;
			// @ts-expect-error
			selectedNames.push(data[ix].name);
		});

		selectedOption.innerText = selectedNames.join(',');
		selectBox.focus();
	};
	export let categoryIsRequired = 'Please select corresponding categories';

	const onChange = () => {
		const selected = Array.from(document.querySelectorAll('#selBox option:checked')).map((el) => {
			// @ts-expect-error
			return { value: el.value, text: el.text };
		});
		selectedOption.innerText = selected.length
			? selected.map((el) => el.text).join(', ')
			: categoryIsRequired;
	};

	let selectedOption: HTMLParagraphElement;
	onMount(() => {
		let options = '';
		data.forEach((opt) => {
			options += '<option id="' + opt.id + '" value="' + opt.id + '">' + opt.name + '</option>';
		});
		const selectBox = document.getElementById('selBox') as HTMLSelectElement;
		selectBox.innerHTML = options;
		selectBox.selectedIndex = 1;
	});

	// categoryIDs does not behave like dynamic and cannot use categoryIDs.length
	// but instead in onClick above we set n = categoryIDs.length which is dynamic
	// we use n and categoryIsRequired to render required message
	$: color = categoryIsRequired === 'Category is required' ? 'pink' : 'skyblue';
</script>

<!-- <pre style="font-size:11px;">categories {JSON.stringify(data, null, 2)}</pre> -->

<div>
	<p style:color bind:this={selectedOption}>
		{categoryIsRequired}
	</p>
	<select id="selBox" on:change={onChange} name="categories" multiple> </select>
</div>
