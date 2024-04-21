import { v4 as uuidv4 } from 'uuid';
import type { PageServerLoad } from './$types';
import { fail, type Actions, type RequestEvent, json, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as utils from '$lib/utils';

export const load: PageServerLoad = (async ({ locals, cookies }) => {
	// admin should be able to see all posts of any user
	// so we have to load all posts with user info

	let userAuthToken = cookies.get('session') || '';
	if (!userAuthToken) {
		throw error(400, 'User cookie not found');
	}
	const user = await db.user.findUnique({
		where: {
			userAuthToken: cookies.get('session')
		}
	});
	if (!user) {
		throw error(400, 'User not found');
	}
	let postAuthors: PostAuthors = [];

	if (locals.user?.role === 'ADMIN') {
		postAuthors = await db.$queryRaw`
			select
				p.id, p.title, p.content, p.created_at as "createdAt", p.updated_at as "updatedAt",
				STRING_AGG(c.id::character varying,',') "categoryIds",
				STRING_AGG(c.name, ',') "categoryNames", u.id as "authorId", p.published,
				u.first_name as "firstName", u.last_name as "lastName", u.role
			from users u
				join post p on p.author_id = u.id
				join "_CategoryToPost" c2p on p.id = c2p."B"
				join category c on c.id = c2p."A"
			group by
					p.id,
					u.id
				order by
					u.first_name asc,
					u.last_name asc;`;
	} else {
		postAuthors = await db.$queryRaw`select
			p.id, p.title, p.content, p.created_at as "createdAt", p.updated_at as "updatedAt",
			STRING_AGG(c.id::character varying,',') "categoryIds",
			STRING_AGG(c.name, ',') "categoryNames", u.id as "authorId", p.published,
			u.first_name as "firstName", u.last_name as "lastName", u.role
		from users u
			join post p on p.author_id = u.id
			join "_CategoryToPost" c2p on p.id = c2p."B"
			join category c on c.id = c2p."A"
		where u.id=${user.id}
		group by
					p.id,
					u.id
		order by
			u.first_name asc,
			u.last_name asc;`;
	}
	const userIDs = [...new Set(postAuthors.map((el) => el.authorId))];
	const users = await db.user.findMany({
		where: {
			id: {
				in: userIDs
			}
		}
	});
	// NOTE:mPrisma array from Postgres
	// const categories = (await db.$queryRaw`SELECT array(SELECT name FROM Category)`) as string[];

	// for Post-Category many-to-many we need array of category.ids
	// but for multiselect we need category names as well
	const categories: { id: number; name: string }[] = await db.category.findMany();
	return {
		postAuthors, // as Todo[] is important for TypeScript
		user,
		users,
		categories
	};
}) satisfies PageServerLoad;

type InputData = {
	id?: string;
	title: string;
	content: string;
	published: string | boolean;
	categoryIDs: string; // comma-separated category ids
	authorId: string;
};
export const actions: Actions = {
	createPost: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData; //{

		const { title, content, published, categoryIDs, authorId } = input_data;
		if (title === '' || content === '' || categoryIDs === '' || authorId === '') {
			return fail(400, {
				data: { title, content, published, categoryIDs, authorId },
				message: 'Insufficient data supplied'
			});
		}
		await utils.sleep(2000);
		let newPost: any;

		const cats = await db.category.findMany();
		try {
			const rest = {
				id: uuidv4(),
				updatedAt: new Date()
			};

			const catIDs = categoryIDs.split(',').map((val) => {
				return { id: Number(val) };
			});
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
		} catch (err) {
			return fail(400, {
				data: { title, content, published, authorId },
				message: 'internal error occurred'
			});
		}
		return {
			success: true,
			message: 'Post successfully created'
		};
	},
	deletePost: async ({ request }) => {
		const body = await request.formData();
		const id = body.get('id') as string;

		if (id === '') {
			return fail(400, { message: 'post id is missing' });
		}
		await utils.sleep(2000);
		try {
			await db.post.delete({
				where: {
					id
				}
			});
		} catch (err) {
			throw new Error('internal error on post delete');
		}
		return {
			success: true,
			message: 'Post successfully deleted'
		};
	},
	updatePost: async ({ request }) => {
		const input_data = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as InputData;

		const { id, title, content, published, categoryIDs, authorId } = input_data;
		if (id === '' || title === '' || content === '' || categoryIDs === '' || authorId === '') {
			return fail(400, {
				data: { id, title, content, published, authorId },
				message: 'Insufficient data supplied'
			});
		}
		await utils.sleep(2000);
		const catIDs = categoryIDs.split(',').map((val) => {
			return { id: Number(val) };
		});
		const categories = await db.category.findMany({
			select: {
				id: true
			}
		});
		try {
			await db.post.update({
				where: {
					id
				},
				data: {
					title,
					content,
					published: published === 'on' ? true : false,
					authorId,
					updatedAt: new Date(),
					categories: {
						disconnect: categories,
						connect: catIDs
					}
				}
			});
		} catch (err) {
			throw new Error('internal error on post update');
		}
		return {
			success: true,
			message: 'Post successfully updated'
		};
	}
} satisfies Actions;
