type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

const ROLES = {
  admin: [
    'view:comments',
    'create:comments',
    'update:comments',
    'delete:comments',
  ],
  moderator: ['view:comments', 'create:comments', 'delete:comments'],
  user: ['view:comments', 'create:comments', 'delete:ownComments'],
  visitor: ['view:comments'],
} as const;

// generates a list of roles admin|moderator|user|visitor
type ERole = keyof typeof ROLES;

// extract permission from role Array<Permission> like from ["view:comments", ...]
// where "view:comments" is a permission as action:object where action is allowed
// on an object, here view is allowed on comments

// Role holds Array<permission> where permission is a string e.g. 'update:comments'
type Permission = ERole[number];


// say users.role is admin and permission is "create:comments"
// so Role[admin] is an array ["view:comments","create:comments" ...]
// check if Role[admin] array (here Roles[user.role] as readonly Permission[])
// includes given permission "create"comments

export const hasPermission = (
  user: TUser,
  permission: Permission,
  authorId?: string | number,
) => {
  if (!user || !permission) return false
  const thePermission = ROLES[user.role as ERole[]] as readonly Permission[];
  const ownPermission = thePermission.map((c) => {
    return c === ':' ? ':own' : c;
  })[0] as string;
  return (
    thePermission.includes(permission) 
  );
};
/*
  ||
    (authorId === user.id && thePermission.includes(ownPermission))
*/