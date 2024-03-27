import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
const dbModel = { post: db.post, user: db.user };
type Model = 'post' | 'user';
// path:  src/routes/api/disconnect/[type]x[id]x[dependenttype]
export const GET: RequestHandler = (async ({ params }) => {
	// console.log('/disconnect', JSON.stringify(params, null, 2));

	const parent = params.type.slice(1, -1) as Model; // remove brackets around the type
	const ID = String(params.id.slice(1, -1)); // remove brackets around the id
	const dependent = params.dependenttype.slice(1, -1);
	// console.log(parent, ID, dependent);

	try {
		// @ts-expect-error
		await dbModel[parent].update({
			where: {
				id: ID
			},
			data: {
				profile: {
					disconnect: true
				}
			}
		});
	} catch (err) {
		console.log('Bane', err);
	}
	throw redirect(303, `/`);
}) satisfies RequestHandler;
