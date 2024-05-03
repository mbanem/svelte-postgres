import { browser } from '$app/environment';

// change placeholder color to red on required messages
export const setColor = (color: string) => {
	if (browser) {
		document.documentElement.style.setProperty('--PLACEHOLDER_COLOR', color);
		setTextColor('--MESSAGE-COLOR', color === 'red' ? 'pink' : color);
	}
};

export const setButtonVisible = (buttons: HTMLButtonElement[]) => {
	resetButtons(buttons);
	if (buttons[0] && buttons[0].classList.contains('hidden')) {
		buttons[0].classList.toggle('hidden');
	}
};

export const resetButtons = (buttons: HTMLButtonElement[]) => {
	try {
		buttons.forEach((btn) => {
			btn.classList.add('hidden');
		});
	} catch {}
};

let fn: string = '';
let ln: string = '';
export const isNameChanged = (firstName: string, lastName: string) => {
	const result = fn === firstName && ln === lastName ? false : true;
	if (result) {
		fn = firstName;
		ln = lastName;
	}
	return result;
};

export const sleep = async (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			// ms here is a dummy value but required by
			// resolve to send out some value
			resolve(ms);
		}, ms);
	});
};

export const arrStringToNumArr = (arr: string[]): Number[] => {
	return arr.map((el) => Number(el));
};

export const csvToNumArr = (s: string): number[] => {
	return s.split(',').map((el) => Number(el));
};

export const setTextColor = (varName: string, color: string) => {
	try {
		const root = document.querySelector(':root');
		if (root) {
			// @ts-expect-error
			root.style.setProperty(varName, color);
		}
	} catch (err) {
		console.log('setTextColor, err');
	}
};

export const capitalize = (str: string) => {
	return str.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, (char) => char.toUpperCase());
};
