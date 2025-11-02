import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type RequestEvent from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt'
import * as utils from '$lib/utils';

export const load: PageServerLoad = (async ({ locals, cookies }) => {

  const users = (await db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
			email: true,
      role: true,
    },
  })) as TKUser[];
	console.log(users);
	await utils.sleep(4000);
  return {
    users,
  };
}) satisfies PageServerLoad;


export const actions: Actions = {
	create: async ({ request }) => {
    console.log('create -- entry point')
		const { firstName, lastName, email, password } = Object.fromEntries(
			// @ts-expect-error
			await request.formData()
		) as {
			firstName: string
			lastName: string
			email: string
			password: string
		};
		console.log('A-User', firstName, lastName, email, password)

		if (firstName === '' || lastName === '' || email === '') {
			return fail(400, {
				data: {
					firstName,
					lastName,
					email
				},
				message: 'Insufficient data supplied'
			})
		}

		const existingUser = await db.user.findFirst({
			where: {
				firstName,
				lastName,
				email
			}
		})
		if (existingUser) {
			return fail(400, {
				data: { firstName, lastName, email },
				message: 'Unacceptable data'
			})
		} else {
			const user = await db.user.create({
				data: {
					firstName,
					lastName,
					email,
					passwordHash: await bcrypt.hash(password, 10),
					userAuthToken: crypto.randomUUID()
				}
			})
		}
		return {
			success: true,
			message: 'a-user created successfully'
		}
	}
} satisfies Actions;

//
//   update: async ({ request }) => {
//     const { bio, bioId, authorId } = Object.fromEntries(
//       // @ts-expect-error
//       await request.formData(),
//     ) as {
//       bio: string;
//       bioId: string;
//       authorId: string;
//     };
//     //console.log(bio, bioId, authorId)
//     if (bio === '' || authorId === '' || bioId === '') {
//       return fail(400, { bio, bioId, message: 'Insufficient data supplied' });
//     }
//     await utils.sleep(2000);
//     try {
//       await db.profile.update({
//         where: {
//           id: bioId,
//           userId: authorId,
//         },
//         data: {
//           bio,
//         },
//       });
//       return {
//         bio,
//         success: 'Profile updated successfully',
//       };
//     } catch (err) {
//       return fail(500, { message: 'Internal error occurred' });
//     }
//   },
//   delete: async ({ request }) => {
//     const body = await request.formData();
//     const id = body.get('authorId') as string;
//     try {
//       await db.profile.delete({
//         where: {
//           userId: id,
//         },
//       });
//     } catch (err) {
//       return fail(400, {
//         data: { authorId: id },
//         message: 'internal error occurred',
//       });
//     }
//     await utils.sleep(2000);
//     return {
//       success: true,
//       message: 'Profile successfully deleted',
//     };
//   }
// } satisfies Actions;