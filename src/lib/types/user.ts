export type TRole = 'VISITOR' | 'USER' | 'ADMIN' | 'MODERATOR';

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  roles: TRole[];
};

export type TOption = {
  id: number;
  year: number;
  role: TRole[];
};