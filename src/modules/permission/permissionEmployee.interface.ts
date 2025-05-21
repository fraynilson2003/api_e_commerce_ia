export interface PermissionEmployee {
  user: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  category: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}
