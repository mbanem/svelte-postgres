import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { fail, type Actions, type RequestEvent, json } from '@sveltejs/kit';

export const load: PageServerLoad = (async () => {
	const users = await db.user.findMany();
	if (!users) {
		return fail(400, { message: 'No users in db' });
	}
	const posts = await db.post.findMany({
		include: {
			author: {
				select: {
					firstName: true,
					lastName: true
				}
			}
		}
	});
	if (!posts) {
		return fail(400, { message: 'No posts in db' });
	}
	// console.log('posts/PageServerLoad users', JSON.stringify(users, null, 2));
	return {
		users: users as User[],
		posts: posts as Post[]
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		// console.log('post/+page.server.ts create');
		const { title, content, authorId } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			title: string;
			content: string;
			authorId: string;
		};
		// console.log(title, content, authorId);
		try {
			const user = await db.user.findUnique({
				where: {
					id: authorId
				}
			});
			if (!user) {
				return fail(400, { post: { title, content, authorId }, message: 'Author notfound' });
			}
			// console.log(JSON.stringify(user, null, 2));
			const post = await db.post.create({
				data: {
					title,
					content,
					author: {
						connect: { id: user?.id }
					}
				},
				include: {
					author: true
				}
			});
			console.log('db.post.create post', post);
			return {
				post: JSON.stringify(post, null, 2)
			};
		} catch (err) {
			console.log('error occurred', JSON.stringify(err, null, 2));
		}
		return;
	}
} satisfies Actions;
