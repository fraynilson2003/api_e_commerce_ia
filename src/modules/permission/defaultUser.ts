import { PermissionEmployee } from './permissionEmployee.interface';

export const defaultPermissionEmployee: PermissionEmployee = {
  user: {
    create: false,
    read: true,
    update: true,
    delete: true,
  },
  category: {
    create: true,
    update: true,
    delete: true,
  },
};
