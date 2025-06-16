import { db } from '$lib/server/db'
import { json } from '@sveltejs/kit';

type TCategory = {
	id:number
	name:string
}
export const GET = async () => {
	const cats = await db.category.findMany();
	const categories = (await cats.json()) as TCategory[]

	console.log('called api', categories);

	return json({ categories });
};

