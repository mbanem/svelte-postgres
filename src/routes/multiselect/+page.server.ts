import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
export const load: PageServerLoad = (async ({}) => {
	const categories = await db.category.findMany();
	// console.log('categories', JSON.stringify(categories, null, 2));
	return {
		categories
	};
}) satisfies PageServerLoad;
