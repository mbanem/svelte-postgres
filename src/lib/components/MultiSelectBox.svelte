<script lang="ts">
	import { onMount } from 'svelte'
	import * as utils from '$utils'
	import { page } from '$app/stores' // for $age.status code on actions

	const pleaseSelect = 'Please select corresponding categories'
	const requiredCategory = 'category is required'
	type ARGS = {
		categories: { id: number; name: string; selected?: boolean }[]
		selectedCategoryIds: string // CSV string
		categoryIsRequired: string
	}
	let {
		categories,
		selectedCategoryIds = $bindable(),
		categoryIsRequired = $bindable()
	}: ARGS = $props()

	let selectedOptions: HTMLParagraphElement
	// cannot be const as the setSelectedOptions rebuilds them via new Set()
	let selectedIds = new Set<string>()
	let selectedNames = new Set<string>()

	export const setSelectedOptions = (arr: number[], selOptions: string) => {
		selectedIds = new Set(arr.map((n) => String(n)))
		selectedNames = new Set(selOptions.split(','))
		if (arr.length === 0) {
			selectedOptions.innerText = categoryIsRequired
			utils.setTextColor('--MESSAGE-COLOR', 'lightgreen')
		} else {
			selectedOptions.innerText = selOptions
			utils.setTextColor('--MESSAGE-COLOR', 'yellow')
		}
		categories = categories.map((cat) => {
			return { id: cat.id, name: cat.name, selected: arr.includes(cat.id) }
		})
	}

	const idFromName = (name: string) => {
		for (let i = 0; i < categories.length; i++) {
			// @ts-expect-error
			if (categories[i].name === name) {
				// @ts-expect-error
				return categories[i].id
			}
		}
	}
	const onClick = (event: MouseEvent) => {
		event.preventDefault()
		const btn = event.target as HTMLButtonElement
		const name = btn.innerText as string
		const id = String(idFromName(name))

		if (
			selectedOptions.innerText === pleaseSelect ||
			selectedOptions.innerText === requiredCategory
		) {
			selectedNames = new Set<string>()
		}

		const add = () => {
			selectedIds.add(id)
			selectedNames.add(name)
			btn.style.color = 'lightgreen'
		}
		const remove = () => {
			selectedIds.delete(id)
			selectedNames.delete(name)
			btn.style.color = 'white'
		}
		selectedIds.has(id) ? remove() : add()
		selectedCategoryIds = [...selectedIds].join(',')
		// we place CSV string in selectedOptions HTML paragraph element
		selectedOptions.innerText =
			selectedNames.size > 0 ? [...selectedNames].join(', ') : categoryIsRequired
	}

	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})

	// color is a colorName as string
	// let color = $derived(() => {
	// 	categoryIsRequired === 'Category is required' ? 'red' : 'skyblue'
	// })
</script>

<!-- <pre style="font-size:11px;">data {JSON.stringify(categories, null, 2)}</pre> -->

<p bind:this={selectedOptions} class="selected-cats">
	{pleaseSelect}
</p>
<ul class="category-list">
	{#key categories}
		{#each categories as category}
			<li>
				<button onclick={onClick} class:selected={category.selected}>
					{category.name}
				</button>
			</li>
		{/each}
	{/key}
</ul>

<style lang="scss">
	.selected-cats {
		width: 42rem;
		height: 1.5rem; // more entries? 2.7rem
		line-height: 1.5rem;
		padding: 4px 1rem;
		margin: 5px 0;
		border: 1px solid gray;
		border-radius: 5px;
		color: var(--MESSAGE-COLOR);
		font-weight: 300;
		font-family: Arial, sans-serif;
	}
	.category-list {
		margin: 8px 0 0 3rem;
	}
	ul {
		list-style: none;
		border: 1px solid yellow;
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
	.selected {
		color: lightgreen;
		width: 100%;
	}

	button {
		border: none;
		outline: none;
		height: 1rem;
		width: 5rem;
		text-align: left;
		padding: 0;
	}
</style>
