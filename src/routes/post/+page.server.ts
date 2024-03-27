import { v4 as uuidv4 } from 'uuid';
import type { PageServerLoad } from './$types';
import { fail, type Actions, type RequestEvent, json, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	// admin should be able to see all todos of any user
	// so we have to load all todos with user info
	// type UPosts = ({
	// 	user: {
	// 		id: string;
	// 		firstName: string;
	// 		lastName: string;
	// 	};
	// } & Post)[];

	let userAuthToken = cookies.get('session') ?? '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}
	// console.log('get user vua userAuthToken', userAuthToken);
	const user = await db.user.findUnique({
		where: {
			userAuthToken: cookies.get('session')
		}
	});
	if (!user) {
		throw error(400, 'User not found');
	}
	// console.log('user', JSON.stringify(user, null, 2));
	// let queryPosts: QueryPosts = [];
	let queryPosts: QueryPosts = [];
	if (locals.user?.role === 'ADMIN') {
		queryPosts = await db.post.findMany({
			include: {
				author: true
			}
		});
	} else {
		queryPosts = await db.post.findMany({
			where: {
				authorId: user.id
			},
			include: {
				author: {
					select: {
						id: true,
						firstName: true,
						lastName: true
					}
				}
			}
		});
	}
	// console.log('queryPosts', JSON.stringify(queryPosts, null, 2));
	const userIDs = [...new Set(queryPosts.map((el) => el.author.id))];
	const users = await db.user.findMany({
		where: {
			id: {
				in: userIDs
			}
		}
	});
	// NOTE:mPrisma array from Postgres
	// const categories = (await db.$queryRaw`SELECT array(SELECT name FROM Category)`) as string[];
	// console.log('categories', JSON.stringify(categories, null, 2));

	// for Post-Category many-to-many we need array of category.ids
	// but for multiselect we need category names as well
	const categories: { id: number; name: string }[] = await db.category.findMany();
	// console.log('categories', JSON.stringify(categories, null, 2));
	return {
		queryPosts, // as Todo[] is important for TypeScript
		user,
		users,
		categories
	};
}) satisfies PageServerLoad;

type InputData = {
	title: string;
	content: string;
	published: string | boolean;
	categoryIDs: string; // comma-separated category ids
	authorId: string;
};
export const actions: Actions = {
	create: async ({ request }) => {
		// const obj = Object.fromEntries(
		// const { title, content, published, categories, authorId } = Object.fromEntries(
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData; //{
		// title: string;
		// content: string;
		// published: boolean;
		// authorId: string;
		// };

		const { title, content, published, categoryIDs, authorId } = input_data;
		if (title === '' || content === '' || categoryIDs.length === 0 || !authorId) {
			return fail(400, {
				error: {
					data: { title, content, published, authorId },
					message: 'Insufficient data supplied'
				}
			});
		}
		console.log('input_data', JSON.stringify(input_data, null, 2));
		let newPost: any;
		// console.log('input_data', JSON.stringify(input_data, null, 2));

		const cats = await db.category.findMany();
		try {
			// console.log('try post.create');
			const rest = {
				id: uuidv4(),
				updatedAt: new Date()
			};

			const catIDs = categoryIDs.split(',').map((val) => {
				return { id: Number(val) };
			});
			// console.log('catIDs', JSON.stringify(catIDs, null, 2));

			newPost = await db.post.create({
				data: {
					title,
					content,
					published: published === 'on' ? true : false,
					authorId,
					updatedAt: new Date(),
					categories: {
						connect: catIDs
					}
				}
			});
			// console.log('{ ...obj}', JSON.stringify({ ...rest, ...obj }, null, 2));
			// console.log('newPost', JSON.stringify(newPost, null, 2));
			// 		title,
			// 		content,
			// 		priority,
			// 		userId: userId
			// 	}
			// });
		} catch (err) {
			// console.log('newPost', JSON.stringify(newPost, null, 2));
			return fail(400, {
				error: {
					data: { title, content, published, authorId },
					message: 'internal error occurred'
				}
			});
		}
		return {
			success: title
		};
	}
} satisfies Actions;
