export class FormatPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export class PermissionEmployee {
  category: FormatPermission;
  product: FormatPermission;
  employee: FormatPermission;
}

export const DefaultPermissionEmployee: PermissionEmployee = {
  category: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  product: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  employee: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
};
