
import { db } from '$server/db'
import { v4 as uuidv4 } from 'uuid'
import * as utils from '$utils'
import { fail, redirect, error } from '@sveltejs/kit'
import type { Actions, PageData, ActionData, PageServerLoad } from './$types'
import bcrypt from 'bcrypt'


export const load: PageServerLoad = (async ({ locals, cookies }) => {
  let uTodos: UTodo[] = []


  let userAuthToken = cookies.get('session') ?? ''
  if (!userAuthToken) {
    locals.user.role = 'VISITOR'
    return
  }

  const user = (await db.user.findUnique({
    where: {
      userAuthToken: cookies.get('session'),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  })) as UserPartial

  if (!user) {
    throw error(400, 'User not found')
  }
  if (locals.user?.role === 'ADMIN') {
    uTodos = (await db.$queryRaw`select
				u.id,
				u.first_name as "firstName",
				u.last_name as "lastName",
				u.role,
				t.id as "todoId",
				t.title,
				t.content,
				t.priority,
				t.completed,
				t.created_at as "createdAt",
				t.updated_at as "updatedAt"
		from 	todo t
		full outer join 	users u on t.user_id = u.id
    where t.id is not null or u.role = 'ADMIN'
		order by 		u.last_name ASC,
								u.first_name ASC,
								t.priority DESC;`) as UTodo[]
  } else {
    uTodos = (await db.$queryRaw`select
					u.id,
					u.first_name as "firstName",
					u.last_name as "lastName",
					u.role,
					t.id as "todoId",
					t.title,
					t.content,
					t.priority,
					t.completed,
					t.created_at as "createdAt",
					t.updated_at as "updatedAt"
			from 	todo t
			join 	users u on t.user_id = u.id
			where u.id = ${user.id}
			order by 		u.last_name ASC,
									u.first_name ASC,
									t.priority DESC;`) as UTodo[]
  }
  const getUser = (id: string) => {
    for (let i = 0; i < uTodos.length; i++) {
      if (id === uTodos[i]?.id) {
        return uTodos[i]
      }
    }
  }

  const users = await db.user.findMany()
  if (!users) {
    return fail(400, { message: 'No users in db' })
  }
  // console.log(users)
  return {
    users
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  create: async ({ request }) => {
    console.log('actions create')
    const data = await request.formData()
    const values = {
      firstName: String(data.get('firstName')),
      lastName: String(data.get('lastName')),
      email: String(data.get('email')),
      passwordHash: await bcrypt.hash(String(data.get('password')), 10),
      userAuthToken: crypto.randomUUID()
    }

    try {
      await db.user.create({ data: values })
      return { success: true }
    } catch (error) {
      return fail(500, { error: 'Failed to create record' })
    }
  },

  update: async ({ request }) => {
    const data = await request.formData()
    const id = String(data.get('id'))
    const values = {
      firstName: String(data.get('firstName')),
      lastName: String(data.get('lastName')),
      email: String(data.get('email')),
      passwordHash: await bcrypt.hash(String(data.get('password')), 10),
      userAuthToken: crypto.randomUUID()
    }

    try {
      await db.user.update({ where: { id }, data: values })
      return { success: true }
    } catch (error) {
      return fail(500, { error: 'Failed to update record' })
    }
  },

  delete: async ({ request }) => {
    const data = await request.formData()
    const id = String(data.get('id'))

    try {
      await db.user.delete({ where: { id } })
      return { success: true }
    } catch (error) {
      return fail(500, { error: 'Failed to delete record' })
    }
  }
};
