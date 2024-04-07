import { browser } from '$app/environment';

// change placeholder color to ren on required messages
export const setColor = (color: string) => {
	if (browser) {
		document.documentElement.style.setProperty('--PLACEHOLDER_COLOR', color);
	}
};

export const toggleButtons = (
	btnSave: HTMLButtonElement,
	btnUpdate: HTMLButtonElement,
	state: string
) => {
	const toggle =
		(btnSave.classList.contains('hidden') && state === 'create') ||
		(btnUpdate.classList.contains('hidden') && state === 'update');
	if (toggle) {
		btnSave.classList.toggle('hidden');
		btnUpdate.classList.toggle('hidden');
	}
};
