
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
  type TRoles = Record<string,  string[]>
	let ROLES:TRoles=[]
	type TRolesList = Record<string,ROLES>
	
	export const selectRoleResource = (roles:string='view'):ROLES => {
		ROLES = getTRolesList(roles) as ROLES
	}
	
	const getTRolesList = (resource:string) => {
		return {
			resource:{
				ADMIN: [
          `view:${resource}`,
					`create:${resource}`,
					`update:${resource}`,
					`delete:${resource}`,
				],
				MODERATOR: [
          `view:${resource}`, 
          `create:${resource}`, 
          `delete:${resource}`
        ],
				USER: [
          `view:${resource}`, 
          `create:${resource}`, 
          `delete:own${resource}`
        ],
				VISITOR: [
          `view:${resource}`
        ]
			} satisfies TRoles
		}
	} 

  // say users.role is admin and permission is "create:{resource}"
  // so Role[admin] is an array ["view:{resource}","create:{resource}" ...]
  // check if Role[admin] array (here Roles[user.role] as readonly Permission[])
  // includes given permission "create"{resource}

  export const hasPermission = (
    user: TUser,
    permission: Permission,
    authorId?: string | number,
  ) => {
    if (!user || user.id === -1 || !ROLES || ROLES.length === 0) return false;
    for (let i = 0; i < user.roles.length; i++) {
      const thePermission = ROLES['resource']
        [user.roles[i]] as readonly Permission[];
      const ownPermission = thePermission.map((c) => {
        return c === ':' ? ':own' : c;
      })[0] as string;
      if (
        thePermission.includes(permission) ||
        (authorId === user.id && thePermission.includes(ownPermission))
      ) {
        return true;
      }
    }
    return false;
  };

