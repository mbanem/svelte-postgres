import { writable, type Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

// ------------- navBars store ------------------
// type TNavBar = { navId: string; pIx: number; oIx: number; activeEl: HTMLInputElement | undefined }
// type TBarContext = Writable<TNavBar[]>

export const setNavBars = (navId: string, pIx: number, oIx: number) => {
	let navBars = writable<TNavBar[]>([{ navId, pIx, oIx, activeEl: undefined }]);
	setContext('navBars', navBars);
};

// NOTE: does not work in the file where defined, see ./+layout.svelte
// export const setNavBar = (navId: string, pIx: number, oIx: number) => {
// 	$navBars.push({ navId, pIx, oIx })
// }
export const getNavBars = () => {
	return getContext<TBarContext>('navBars');
};

// let navBarsStore: TNavBar[]
// const keepNavStore = (store: TNavBar[]) => {
// 	navBarsStore = store
// }
