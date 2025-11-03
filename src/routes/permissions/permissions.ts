type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  roles: string[];
};

// generates a list of roles admin|moderator|user|visitor
type ERole = keyof typeof ROLES;
// extract permission from role Array<Permission> like from ["view:comments", ...]
// where "view:comments" is a permission as action:object where action is allowed
// on an object, here view is allowed on comments

// Role holds Array<permission> where permission is a string e.g. 'update:comments'
type Permission = ERole[number];
export const actionResourceList = [
  'view:comments',
  'create:comments',
  'update:comments',
  'delete:comments',
]
const ROLES = {
  ADMIN: [
    'view:comments',
    'create:comments',
    'update:comments',
    'delete:comments',
  ],
  MODERATOR: ['view:comments', 'create:comments', 'delete:comments'],
  USER: ['view:comments', 'create:comments', 'delete:ownComments'],
  VISITOR: ['view:comments'],
} as const;

// say users.role is admin and permission is "create:comments"
// so Role[admin] is an array ["view:comments","create:comments" ...]
// check if Role[admin] array (here Roles[user.role] as readonly Permission[])
// includes given permission "create"comments

export const hasPermission = (
  user: TUser,
  permission: Permission,
  authorId?: string | number,
) => {
  if (!user || user.id === -1) return false
  for (let i=0; i < user.roles.length; i++){
    const thePermission = ROLES[user.roles[i] as ERole] as readonly Permission[];
    const ownPermission = thePermission.map((c) => {
      return c === ':' ? ':own' : c;
    })[0] as string;
    if (
      thePermission.includes(permission) ||
      (authorId === user.id && thePermission.includes(ownPermission))
    ){
      return true;
    }
  }
  return false
};
