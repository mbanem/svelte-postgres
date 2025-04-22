// as we import json structure from a .ts file that we typed as
// PageData  TS keeps data type information as defined in the ts file
import { data } from '$lib/news_articles';

export const load: PageServerLoad = (async ({}) => {
	return {
		data
	};
}) satisfies PageServerLoad;
