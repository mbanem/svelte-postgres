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
const counter = createCounter()
export const getGlobalCounter = () => {
	return counter
}

const createGlobalVolume = () => {
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

export const globalVolume = createGlobalVolume()

// @ts-expect-error
Number.prototype[Symbol.iterator] = function* () {
	// @ts-expect-error
	for (let i = 0; i < this; i++) {
		yield i
	}
}
