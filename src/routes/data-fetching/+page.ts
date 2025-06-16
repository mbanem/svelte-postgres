/*
    This page lays in the boundary between the server and client and initially is
    run and rendered on the server and after sending it to the client and hydrating
    all the subsequent activities are executed on the client. 
    It cannot access database or anything private on the server and all data fetching
    must be done via external public API -- and is called Universal Function
*/

import type { PageLoad } from './$types';
type TColor = {
  id: number;
  name: string;
  hex: string
}

export const load = (async ({ fetch, data }) => {
	const res = await fetch('https://api.sampleapis.com/csscolornames/colors');
	const extData = (await res.json()) as TColor[];
	const randomStrings = data.randomStrings;
	const sampleTodos = data.userTodos;
	return { sampleCSSColors: extData, sampleTodos, randomStrings };
}) satisfies PageLoad;