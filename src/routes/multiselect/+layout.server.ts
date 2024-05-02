// it has a prefix + as it IS part of route files like +page.svelte or +layout.svelte
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({}) => {
	const categories = await db.category.findMany();
	return {
		categories,
		sections: [
			{ slug: 'select-box', title: 'SelectBox' },
			{ slug: 'select-list', title: 'SelectList' }
		]
	};
}) satisfies LayoutServerLoad;
