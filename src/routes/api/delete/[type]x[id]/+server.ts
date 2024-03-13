import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
const dbModel = { post: db.post, user: db.user };

type Model = 'post' | 'user';
export const GET: RequestHandler = (async ({ params }) => {
	const table = params.type.slice(1, -1) as Model; // remove brackets around the type
	const ID = params.id.slice(1, -1); // remove brackets around the id
	console.log('id', ID);
	try {
		console.log(table, ID);
		// @ts-expect-error
		await dbModel[table].delete({
			where: {
				id: ID
			},
			posts: {
				set: []
			},
			profile: {}
		});
	} catch (err) {
		console.log(err);
	}
	throw redirect(303, `/${table}`);
}) satisfies RequestHandler;
