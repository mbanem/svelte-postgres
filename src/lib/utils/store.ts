import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

// ------------- navBars store ------------------
// type TNavBar = { navId: string; pIx: number; oIx: number; activeEl: HTMLInputElement | undefined }
// type TBarContext = Writable<TNavBar[]>
const NAV_BARS = 'navBars';
const NAV_BUTTONS = 'navButtons';

export const setNavBars = (navId: string, Ix: number, startIx: number) => {
	let navBars = writable<TNavBar[]>([{ navId, Ix, startIx, activeEl: undefined }]);
	setContext(NAV_BARS, navBars);
};

// NOTE: does not work in the file where defined, see ./+layout.svelte
// export const setNavBar = (navId: string, Ix: number, startIx: number) => {
// 	$navBars.push({ navId, Ix, startIx })
// }
export const getNavBars = () => {
	return getContext<TBarContext>(NAV_BARS);
};

export const setNavButtons = (
	position: number,
	className: string,
	ix: number,
	href: string,
	title: string,
	condition: string
) => {
	let navButtons = writable<TNavButton[]>([{ position, className, ix, href, title, condition }]);
	setContext(NAV_BUTTONS, navButtons);
};
export const getNavButtons = () => {
	return getContext<TNavButtonContext>(NAV_BUTTONS);
};
