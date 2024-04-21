import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
export const load: PageServerLoad = (async ({}) => {
	const categories = await db.category.findMany();
	return {
		categories
	};
}) satisfies PageServerLoad;
