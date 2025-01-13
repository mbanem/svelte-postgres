import { setError, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { message } from 'sveltekit-superforms';
// import { fail } from '@sveltejs/kit';
// Define outside the load function so the adapter can be cached
const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  company: z.string().min(3),
});

export const load = async () => {
  const form = await superValidate(zod(schema));

  // Always return { form } in load functions
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schema));
    console.log(form);

    if (!form.valid) {
      if (form.data.firstName.length < 3) {
        console.log('first name is too short');
        setError(form, 'firstName', 'At least 3 characters');
      }
      // Again, return { form } and things will just work.
      return fail(400, { form });
    }

    // TODO: Do something with the validated form.data
    // console.log(form)

    // Display a success status message
    return message(form, 'Form posted successfully!');
  },
};
