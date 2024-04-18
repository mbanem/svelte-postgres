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

	export let select_box: any;
	export const setSelectedIds = (arr: number[]) => {
		const selectBox = document.getElementById('selBox') as HTMLSelectElement;
		const options = selectBox.options as HTMLOptionsCollection;
		for (let i = 0; i < options.length; i++) {
			(options[i] as HTMLOptionElement).selected = false;
		}
		selectBox.selectedIndex = -1;
		const selectedNames = [];
		if (arr.length) {
			for (let i = 0; i < arr.length; i++) {
				// @ts-expect-error
				selectBox.options[arr[i]].selected = true;
				// @ts-expect-error
				selectedNames.push(data[arr[i]].name);
			}
		}
		export const categoryIdsToForm: (ids:string)=>void;
		selectedOption.innerText = selectedNames.join(',');
		selectBox.focus();
	};
	export let selected_categories: any;
	export let categoryIsRequired = 'Please select corresponding categories';

	const onChange = () => {
		// get selected options values
		const selected = Array.from(document.querySelectorAll('#selBox option:checked')).map((el) => {
			// @ts-expect-error
			return el.value;
		}).join(',');
		if (selected.length){
			categoryIdsToForm(selected)
		}
		selectedOption.innerText = selected.length > 0 ? selected : categoryIsRequired;
	};
	// to silence TS as props are quoted class names and so hidden from it
	let x = select_box !== null && selected_categories !== null;

	let selectedOption: HTMLParagraphElement;
	// const dispatcher = createEventDispatcher<{ categoryids: { ids: number[]; names: string[] } }>();

	// let n = 0;
	// const onClick = (event: MouseEvent) => {
	// 	// const opts = Array.from(document.querySelectorAll('#categories option'));
	// 	const opts = (event.currentTarget as HTMLSelectElement).options;
	// 	const isSelected = (option: HTMLOptionElement) => {
	// 		return selected.includes(option.value);
	// 	};
	// 	const removeSelected = (option: HTMLOptionElement) => {
	// 		selected = selected.filter((opt) => opt !== option.value);
	// 		categoryIDs = categoryIDs.filter((id) => id !== Number(option.id));
	// 	};
	// 	for (var i = 0; i < opts.length; i++) {
	// 		if (opts[i]?.selected) {
	// 			if (isSelected(opts[i] as HTMLOptionElement)) {
	// 				removeSelected(opts[i] as HTMLOptionElement);
	// 			} else {
	// 				selected.push((opts[i] as HTMLOptionElement).value);
	// 				categoryIDs.push(Number((opts[i] as HTMLOptionElement).id));
	// 			}
	// 		}
	// 	}
	// 	dispatcher('categoryids', { ids: categoryIDs, names: selected });
	// 	// window.ct = ct;  // use ct object in development pane
	// 	selectedOption.innerText = selected.length > 0 ? selected.join(', ') : categoryIsRequired;
	// };
	onMount(() => {
		let options = '';
		data.forEach((opt) => {
			options += '<option id="' + opt.id + '" value="' + opt.name + '">' + opt.name + '</option>';
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

<div class="class.select-container">
	<p class="selected_categories" style:color bind:this={selectedOption}>
		{categoryIsRequired}
	</p>
	<select id="selBox" on:change={onChange} class="select_box" name="categories" multiple> </select>
</div>
