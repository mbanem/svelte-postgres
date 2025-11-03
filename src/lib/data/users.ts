import type { TUser, TRole, TOption } from '$lib/types/user';

export const users = {
    Matia: {
      id: 31814560165,
      firstName: 'Matia',
      lastName: 'Isakovic',
      roles: getRoles(31814560165),
    },
    Filip: {
      id: 63811846353,
      firstName: 'Filip',
      lastName: 'Isakovic',
      roles: getRoles(63811846353),
    },
    Marko: {
      id: 65031853491,
      firstName: 'Marko',
      lastName: 'Milutinovic',
      roles: getRoles(65031853491),
    },
    Mia: {
      id: 301897108,
      firstName: 'Mia',
      lastName: 'Milutinovic',
      roles: getRoles(301897108),
    },
  } satisfies Record<string. TUser>;

  // Optional helper:
  // keyof typeof users accepts only names from above users
  export function getUser(name: keyof typeof users) {
    return users[name];
  }

function getRoles(id: number): TRole[] {
  return users.filter(user => user.id === id)[0].roles
}

  export const options = [
    // Matia
    { id: 31814560165, year: 2019, role: ['VISITOR'] },
    { id: 31814560165, year: 2020, role: ['USER'] },
    { id: 31814560165, year: 2021, role: ['ADMIN'] },
    { id: 63811846353, year: 2018, role: ['VISITOR'] },
    // Filip
    { id: 63811846353, year: 2019, role: ['VISITOR', 'USER'] },
    { id: 63811846353, year: 2020, role: ['VISITOR', 'ADMIN'] },
    { id: 65031853491, year: 2023, role: ['VISITOR', 'USER'] },
    // Marko
    { id: 65031853491, year: 2024, role: ['VISITOR'] },
    { id: 65031853491, year: 2025, role: ['VISITOR'] },
    // Mia
    { id: 301897108, year: 2022, role: ['VISITOR'] },
    { id: 301897108, year: 2023, role: ['VISITOR', 'USER'] },
    { id: 301897108, year: 2024, role: ['VISITOR', 'USER', 'ADMIN'] },
  ] satisfies TOption[];