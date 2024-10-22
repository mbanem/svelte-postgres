<script lang="ts">
	import MoveButtons from './MoveButtons.svelte'
	// import Explanation from './Explanation.svelte'

	import { crossfade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { flip } from 'svelte/animate'
	import { onMount } from 'svelte'
	import { page } from '$app/stores' // for $age.status code on actions
	import * as utils from '$utils'
	// dirty function to quickly generate some keys

	type ChildObject = {
		readonly text: string
	}
	type FamilyObject = {
		readonly id: number
		readonly text: string
		readonly childObjects: ChildObject[]
		// inside the object _childObjects are read only so we need addChildToFamily method
		addChildToFamily: (_: ChildObject) => void
		isChildObjectInTheList: (childObject: ChildObject) => boolean
		childrenSelBox: HTMLSelectElement
		selectedChildId: string
	}

	// family can be created only once se we keep the list
	let listOfCreatedFamilies: Array<number> = []
	// when child is moved into another family bounds we flag them as visitors
	let visitor = ''
	// children array of Array<[name1, name2, current-index, number-of=names]>

	// clicking inside parent to add  child we use parent id to
	// match with the key of children record.
	// We take number of children in parents record as an index to get
	// child name -- no children is index 0, one child is index 1 and so on
	let children: Record<number, string[]> = {
		0: ['Matia', 'Filip'],
		1: ['Mia', 'Marko'],
		2: ['Bojana', 'Nikola'],
		3: ['Jovana', 'Milica']
	}
	//.map((c) => [...c, 0, c.length]) as string[][]
	let selectFamilyIx = $state<string>()
	const parents = [
		['Snezana', 'Ljubomir', 'Isakovic'],
		['Tanja', 'Ljuban', 'Milutinovic'],
		['Dragana', 'Zeljko', 'Kotur'],
		['Mirjana', 'Sasa', 'Krsmanovic']
	].map((p, ix) => [ix, ...p])
	// state
	// creator takes ChildObject (a string) and returns FamilyObject
	// an object with three getters for id, text and childObjects

	// for selected family in <select-box the select-box value is an
	// index of family names to create
	const parentNames = (ix: number) => {
		if (ix >= parents.length) return
		const p = parents[ix]
		if (!p) return
		return `${p[1]} and ${p[2]} ${p[3]}`
	}

	// ChildObject and Other are objects with read-only properties
	// but with getters and one setters like method addChildToFamily
	// ix is parents index
	const createFamily = (ix: number) => {
		// select-box is changed and it calls this method, while its
		// value is bound to selectFamilyIx variable

		// alert('Creating new familyObject with index ' + ix)
		if (listOfCreatedFamilies.includes(ix)) {
			return alert('Family is already shown')
		}

		// get 1st parent and 2cnd parent names and family name
		const p = parents[ix]
		// console.log(p)

		// wile p[0] is in parents array we need id in the object
		let _text = `<p style='color: blue;font-size: 24px;font-style: italic;'>${parentNames(ix)}</p>`

		// no childObjects when family object is created but should be added later n
		let _childObjects = $state<Array<ChildObject>>([])
		// every family gets new children select box and its reference is bound to
		// this dynamic variable
		let _childrenSelBox = $state<HTMLSelectElement>()
		// NOTE: specifying <option selected>..</option> does not work, so workaround
		// is to bind select box value to _selectedChildId (property of this object) and
		// set it to value desired; here to string '0'
		let _selectedChildId: string = '0'

		// flag that family is created to avoid another creation attempts
		listOfCreatedFamilies.push(ix)
		return {
			get id() {
				return ix
			},
			get text() {
				return _text
			},
			get childObjects() {
				return _childObjects
			},
			addChildToFamily(ChildObject: ChildObject) {
				_childObjects.push(ChildObject)
			},
			isChildObjectInTheList(childObject: ChildObject) {
				return _childObjects.includes(childObject) as boolean
			},
			get childrenSelBox() {
				return _childrenSelBox as HTMLSelectElement
			},
			set childrenSelBox(value: HTMLSelectElement) {
				_childrenSelBox = value
			},
			get selectedChildId() {
				return _selectedChildId as string
			},
			set selectedChildId(value: string) {
				_selectedChildId = value
			}
		} as FamilyObject
	}

	// childObject should be created inside a family so we need
	// family object, i.e. the Other
	const createChildObject = (familyObject: FamilyObject, childName: string) => {
		// suppress creating the same child object multiple times
		for (let i = 0; i < familyObject.childObjects.length; i++) {
			if (familyObject.childObjects[i]?.text === childName)
				return alert(`${childName} is already included in this family`), false
		}
		const fid = familyObject.id
		// parents and children shortcut
		const p = parents[fid]
		// check if childName is in children list fot this parents
		if (!children[fid]?.includes(childName)) alert(`${childName} is not from this family`)

		return {
			get text() {
				return childName
			}
		} as ChildObject
	}
	// create the initial list
	let list = $state<FamilyObject[]>([])

	// // for moving items inside the list array
	const moveFamilyObject = (familyObject: FamilyObject, shift: number) => {
		// find index of familyObject in list to move to another position
		const fromIx = list.indexOf(familyObject)
		// make sure to check array bounds for new position
		const toIx = fromIx + shift > list.length || fromIx + shift < 0 ? fromIx : fromIx + shift

		// the (list.splice(fromIx, 1) removes the element from index fromIx, and returns
		// that as an an array of one element
		utils.array_move(list, fromIx, toIx)
	}

	const moveChildObject = (familyObject: FamilyObject, childObject: ChildObject, shift: number) => {
		console.log('shift', shift)
		const familyFrom = list.indexOf(familyObject)
		const childFrom = familyObject.childObjects.indexOf(childObject)

		// check array bounds, but make sure to move the childObject to the adjacent familyObject
		// if one is available
		let familyTo = familyFrom
		let childTo = 0
		const CFS = childFrom + shift

		if (CFS < familyObject.childObjects.length && CFS >= 0) {
			// we shift within the same familyObject!
			childTo = CFS
		} else if (CFS >= familyObject.childObjects.length && familyFrom + shift < list.length) {
			// we shift to first item of the next familyObject
			familyTo += 1
			childTo = 0
		} else if (childFrom + shift < 0 && familyFrom + shift >= 0) {
			// we shift to the last item of the previous familyObject
			familyTo -= 1
			childTo = Number(list[familyTo]?.childObjects.length)
		} else {
			return alert('Cannot move child to this position')
		}

		visitor = children[familyTo]?.includes(childObject.text) ? '' : '  -- visitor'
		const moved = list[familyFrom]?.childObjects.splice(childFrom, 1)[0] as ChildObject
		console.log(familyFrom, familyTo, childFrom, childTo)
		list[familyTo]?.childObjects.splice(childTo, 0, moved)
	}

	// for adding new items
	const addChildToFamily = (familyObject: FamilyObject) => {
		const childrenSelBox = familyObject.childrenSelBox as HTMLSelectElement
		const cid = Number(familyObject.selectedChildId)
		const childName = (childrenSelBox.options[cid] as HTMLOptionElement).innerText
		const child = createChildObject(familyObject, childName)
		if (child) {
			familyObject.addChildToFamily(child)
			// remove selected child when successfully added
			;(childrenSelBox.options[cid] as HTMLOptionElement).style.color = 'red'
		}
	}

	const showFamily = () => {
		const ix = selectFamilyIx as string
		const familyObject = createFamily(ix) as FamilyObject
		list.push(familyObject)
		selectFamilyIx = '100'
	}

	// transition
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback() {
			return {
				duration: 300,
				easing: cubicInOut,
				css: () => `
				opacity: 0;
			`
			}
		}
	})

	const hideTopOption = (event: MouseEvent | KeyboardEvent) => {
		const sb = event.target as HTMLSelectElement
		if (sb.options[0]) {
			sb.options[0].style.display = 'none'
		}
	}
	const movingDisabled = (
		familyObject: FamilyObject,
		childObject: ChildObject,
		buttonUp: boolean
	) => {
		const listMaxIx = list.length - 1
		const lastChildIx = familyObject.childObjects.length - 1
		const fix = list.findIndex((fo) => fo.id === familyObject.id)
		const cix = familyObject.childObjects.findIndex((co) => co.text === childObject.text)
		return (
			(fix === 0 && cix === 0 && buttonUp) ||
			(fix === listMaxIx && cix === lastChildIx && !buttonUp)
		)
	}
	onMount(() => {
		return () => {
			utils.setMrPath($page.url.pathname)
		}
	})
</script>

<a href="/cross_fade">to Cross Fade</a>
<div class="wrap-all">
	<!-- <Explanation /> -->

	<ul class="container">
		<div class="header">
			<label for="parents"
				>Choose family:
				<select
					bind:value={selectFamilyIx}
					onfocus={hideTopOption}
					name="parents"
					id="parents"
					onchange={showFamily}
				>
					<option selected value="100">Select Family to Show</option>
					{#each parents as parent, ix}
						<option value={ix}>{parent[3]}</option>
					{/each}
				</select>
			</label>
		</div>
		<!-- all activities finish in changing the list array, which in turn
				generates the following markup 
		-->
		{#each list as familyObject, ix (familyObject.text)}
			{@const lfix = list.length - 1}
			<li class="family-object container" animate:flip={{ duration: 300 }}>
				<MoveButtons
					actionUp={moveFamilyObject(familyObject, -1)}
					actionDown={moveFamilyObject(familyObject, 1)}
					first={ix === 0 || lfix === 0}
					last={ix === lfix}
				/>
				<ul class="content">
					<div class="header">
						<span>{@html familyObject.text}</span>
						<label for="newInner"
							>Append child for family
							<select
								bind:this={familyObject.childrenSelBox}
								bind:value={familyObject.selectedChildId}
								onfocus={hideTopOption}
								name="newInner"
								id="newInner"
								onchange={() => addChildToFamily(familyObject)}
							>
								<option value="0">Select Child to add to Family </option>
								{#each children[familyObject.id] as string[] as child, ix}
									<!-- value is set as a number but HTML renders it as a string -->
									<option value={ix + 1}>{child}</option>
								{/each}
							</select>
						</label>
					</div>

					{#each familyObject.childObjects as childObject, jx (childObject.text)}
						{@const lcix = familyObject.childObjects.length - 1}
						<li
							class="child-object container"
							in:receive={{ key: childObject.text }}
							out:send={{ key: childObject.text }}
							animate:flip={{ duration: 300 }}
						>
							<!-- NOTE: what I think is that disabled only works with boolean expressions
						but not with functions, so we use @cons var = last index to handle top first
						and last bottom button. Notice that if below the last child button there is a
						empty family the button is not disabled as the child can move thers as a visitor
						-->
							<div class="up-down">
								<button
									disabled={ix === 0 && jx === 0}
									onclick={() => moveChildObject(familyObject, childObject, -1)}
								>
									↑
								</button>
								<button
									disabled={lfix == ix && lcix == jx}
									onclick={() => moveChildObject(familyObject, childObject, 1)}
								>
									↓
								</button>
							</div>
							<div class="content">
								{childObject.text}
								{visitor}
							</div>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>

<style>
	.up-down {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid;
		padding: 0.5rem 0.5rem;
		margin: -1rem 0 -1rem -1rem;
		gap: 0.5rem;
	}
	.wrap-all {
		margin-left: 5rem !important;
	}
	.container {
		border: 1px solid gray;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 80vw;
		/* margin: 0 auto; */
	}

	.family-object,
	.child-object {
		display: flex;
		flex-direction: row;
		width: 98.4%;
		background-color: bisque;
		/* border: 1px solid pink; */
	}

	.family-object > .content,
	.child-object > .content {
		flex: 1;
		padding: 0 0 0 1rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 90%;
		background-color: aliceblue;
		font-size: 18px;
		color: black;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		/* border: 1px solid yellow; */
	}
	select option {
		width: max-content;
		padding: 3px 2rem;
		text-align: left;
		font-size: 18px;
		color: blue;
	}
	button:disabled {
		background-color: darkgray !important;
		cursor: not-allowed;
	}
</style>
