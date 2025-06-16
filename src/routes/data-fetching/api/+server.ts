import { db } from '$lib/server/db'
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const categories = await db.category.findMany();

	// console.log('called api', categories);

	return json({ categories });
};