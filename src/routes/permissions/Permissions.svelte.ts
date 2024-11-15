type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

// generates a list of roles admin|moderator|user|visitor
type Role = keyof typeof ROLES;
// extract permission from role Array<Permission> like from ["view:comments", ...]
// where "view:comments" is a permission as action:object where action is allowed
// on an object, here view is allowed on comments

// Role holds Array<permission> where permission is a string e.g. 'update:comments'
type Permission = Role[number];

const ROLES = {
  admin: [
    'view:comments',
    'create:comments',
    'update:comments',
    'delete:comments',
  ],
  moderator: ['view:comments', 'create:comments', 'delete:comments'],
  user: ['view:comments', 'create:comments'],
  visitor: ['view:comments'],
} as const;

// say users.role is admin and permission is "create:comments"
// so Role[admin] is an array ["view:comments","create:comments" ...]
// check if Role[admin] array (here Roles[user.role] as readonly Permission[])
// includes given permission "create"comments
export const hasPermission = (user: User, permission: Permission) => {
  return (ROLES[user.role as Role] as readonly Permission[]).includes(
    permission,
  );
};
