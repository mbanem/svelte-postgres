import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
const dbModel = { post: db.post, user: db.user };

type Model = 'post' | 'user';
export const GET: RequestHandler = (async ({ params }) => {
	const table = params.type.slice(1, -1) as Model; // remove brackets around the type
	const ID = params.id.slice(1, -1); // remove brackets around the id
	try {
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

export const POST: RequestHandler = (async ({ params }) => {
	try {
		// for this existing schema delete does not work as the User record
		// has relationship with Profile, Post[] and Article[] and there is
		// no onDelete cascade, setNull
		const user = await db.user.delete({
			where: {
				id: String(params)
			}
		});
	} catch (err) {
		console.log('api delete endpoint', err);
	}
	return new Response(
		JSON.stringify({
			success: true
		}),
		{
			headers: {
				ContentType: 'application/json'
			}
		}
	);
}) satisfies RequestHandler;
