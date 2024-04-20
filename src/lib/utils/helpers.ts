import { browser } from '$app/environment';

// change placeholder color to ren on required messages
export const setColor = (color: string) => {
	if (browser) {
		document.documentElement.style.setProperty('--PLACEHOLDER_COLOR', color);
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
			// resolve to get some argument
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
