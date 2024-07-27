import { browser } from '$app/environment'

export const sixHash = () => {
	const a = (Math.random() * 46656) | 0
	const b = (Math.random() * 46656) | 0
	return a.toString(36).slice(-3) + b.toString(36).slice(-3)
}

// short id
export const id = () => {
	return (Math.random() * 10 ** 8).toString(36).replace(/\./g, '')
}

// change placeholder color to red on required messages
export const setColor = (color: string) => {
	if (browser) {
		document.documentElement.style.setProperty('--PLACEHOLDER_COLOR', color)
		setTextColor('--MESSAGE-COLOR', color === 'red' ? 'pink' : color)
	}
}

export const setButtonVisible = (buttons: HTMLButtonElement[]) => {
	resetButtons(buttons)
	if (buttons[0] && buttons[0].classList.contains('hidden')) {
		buttons[0].classList.toggle('hidden')
	}
}

export const resetButtons = (buttons: HTMLButtonElement[]) => {
	try {
		buttons.forEach((btn) => {
			btn.classList.add('hidden')
		})
	} catch {}
}

let fn: string = ''
let ln: string = ''
export const isNameChanged = (firstName: string, lastName: string) => {
	const result = fn === firstName && ln === lastName ? false : true
	if (result) {
		fn = firstName
		ln = lastName
	}
	return result
}

export const sleep = async (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			// ms here is a dummy value but required by
			// resolve to send out some value
			resolve(ms)
		}, ms)
	})
}

export const arrStringToNumArr = (arr: string[]): Number[] => {
	return arr.map((el) => Number(el))
}

export const csvToNumArr = (s: string): number[] => {
	return s.split(',').map((el) => Number(el))
}

export const setTextColor = (varName: string, color: string) => {
	try {
		const root = document.querySelector(':root')
		if (root) {
			// @ts-expect-error
			root.style.setProperty(varName, color)
		}
	} catch (err) {
		console.log('setTextColor, err')
	}
}

// define iterable number using object prototype and generator
// function* to assign it to the Number iterator
// @ts-expect-error
// use as sequence iterator
// 			[...10].forEach(n => console.log(n))
Number.prototype[Symbol.iterator] = function* () {
	// @ts-expect-error
	for (let i = 0; i < this; i++) {
		yield i
	}
}

export const capitalize = (str: string) => {
	const spaceUpper = (su: string) => {
		return ` ${su[1]?.toUpperCase()}`
	}
	return str
		.toLowerCase()
		.replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase())
		.replace(/(_\w)/, spaceUpper)
}

// Capitalize as a String method
// @ts-expect-error
String.prototype.capitalize = function () {
	// @ts-expect-error
	return capitalize(this)
}

const isKeyOf = <T extends Object>(key: keyof T, obj: T): key is keyof T => {
	return key in obj
}

const _shallowCopy = <S extends Object, T extends S>(source: S, target: T): T => {
	for (const k of Object.keys(target)) {
		if (isKeyOf<S>(k as keyof S, target)) {
			// @ts-expect-error
			target[k] = source[k as keyof T]
		}
	}
	return target
}
export const shallowCopy = (source: Object, target: Object): Object => {
	return _shallowCopy(source, target)
}
//  Test Items
// let source: T[] = [
// 	{ id: '14', name: 'Matia', age: '21' },
// 	{ id: '22', name: 'Filip', age: '18', city: 'San Diego' }
// ];

type T = Record<string | number, unknown>
// NOTE: filter returns array
export const selectRecordItems = <T extends unknown>(
	keyName: keyof T,
	key: string,
	arr: T[]
): T => {
	const item = arr.filter((el) => el[keyName] === key) as T
	return item
}

// example
// console.log(selectItem<T>('name', 'Filip', source));
// console.log(selectItem<T>('id', '14', source));

export const copyPairingAttributes = <S, T extends Object>(
	source: S,
	target: T,
	pairs: Object
): T => {
	for (const [k, v] of Object.entries(pairs)) {
		// if (isKeyOf<T>(k as keyof T, target)) {
		// @ts-expect-error
		target[v] = source[k as keyof T] as string | number
		// }
	}
	return target
}
