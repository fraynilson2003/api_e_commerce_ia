import { PermissionUser } from '../permission/permissionUser.interface';

export const defaultPermissionUser: PermissionUser = {
  user: {
    create: false,
    delete: false,
    read: false,
    update: false,
  },
  category: {
    create: false,
    delete: false,
    update: false,
  },
  order: {
    createMyOrder: true,
    createOtherOrder: false,
  },
};
