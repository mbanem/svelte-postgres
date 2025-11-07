<script lang="ts">

  type TRole = 'VISITOR' | 'USER' | 'MODERATOR' | 'ADMIN';
  type TIdRole = Record<number, TRole[]>;
  type TUserNameIds = Record<string, number>;

  const userNameIds = {
    'Matia Isakovic': 31814560165,
    'Filip Isakovic': 63811846353,
    'Marko Milutinovic': 65031853491,
    'Mia Milutinovic': 301897108,
  } satisfies TUserNameIds;

  const idYearRoles: Record<number, TIdRole> = {
    // Matia
    31814560165: {
      2019: ['VISITOR'],
      2020: ['USER', 'MODERATOR'],
      2021: ['ADMIN'],
      2018: ['VISITOR'],
    },
    // Filip
    63811846353: {
      2019: ['VISITOR', 'USER'],
      2020: ['VISITOR', 'ADMIN'],
      2023: ['VISITOR', 'USER'],
    },
    // Marko
    65031853491: { 2024: ['VISITOR'], 2025: ['VISITOR'] },
    // Mia
    301897108: {
      2022: ['VISITOR'],
      2023: ['VISITOR', 'USER'],
      2024: ['VISITOR', 'USER', 'ADMIN'],
    },
  };

  // function yearRoles(key: string | number): TIdRole {
  //   if (typeof key === 'string') {
  //     const id = userNameIds[key as keyof typeof userNameIds]; // ✅ safe
  //     return idYearRoles[id as number] as TIdRole;
  //   }
  //   return idYearRoles[key] as TIdRole;
  // }
  function userYearRoles(key: string | number): TIdRole {
    const id: number =
      typeof key === 'string'
        ? (userNameIds[key as keyof typeof userNameIds] as number)
        : key;
    return idYearRoles[id] as TIdRole;
  }
  function userFirstYearRoles(key: string | number): TIdRole {
    return Object.entries(userYearRoles(key))[0] as TIdRole;
  }
  function userRolesOfYear(key: string|number, year:number):TIdRole{
    // const yearRoles = ;
		return Object.entries(userYearRoles(key)).filter(el => el[0]===String(year))[0]?[1]
	}
  const name = 'Matia';
  const id = 63811846353;
  console.log(yearRoles(name));
  console.log(yearRoles(id));
</script>
