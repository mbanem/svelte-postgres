// as we import json structure from a .ts file that we typed as
// PageData  TS keeps data type information as defined in the ts file
import { data } from '$lib/news_articles';

/** @type {import{'./$types}.PageServerLoad} */
export function load() {
	return { data }; // data is object already se we do not use {'keys': data }
}
