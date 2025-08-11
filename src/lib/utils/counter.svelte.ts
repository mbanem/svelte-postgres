// filename.svelte.ts module is a new construct in svelte 5
// earlier we only had +page.server.ts, +page.ts and helper.ts files

export const createCounter = (val: number = 0) => {
	let count = $state(val)

	return {
		get count() {
			return count
		},
		set count(val: number) {
			count = val
		},
		increment: () => (count += 1),
		decrement: () => (count -= 1)
	}
}

// create a counter
const counter = createCounter()

// any page can get this counter as this way it is global 
export const getGlobalCounter = () => {
	return counter
}

// this is another global store like global counter above
const volumeStore = () => {
	let volume = $state(0)
	return {
		get volume() {
			return volume
		},
		set volume(val: number) {
			volume = val
		}
	}
}

export const globalVolume = volumeStore()

// @ts-expect-error
Number.prototype[Symbol.iterator] = function* () {
	// @ts-expect-error
	for (let i = 0; i < this; i++) {
		yield i
	}
}

export let navPath = $state<string>('/');

export let prevPath = $state('/');

let mrPath = $state<string>('/');
export const getMrPath = () => {
	return mrPath as string
}
export const setMrPath = (path: string) => {
	mrPath = path
}
	