export interface PermissionUser {
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
  order: {
    createMyOrder: boolean;
    createOtherOrder: boolean;
    editMyOrder: boolean;
    editOtherOrder: boolean;
    deleteOtherOrder: boolean;
  };
  shoppingCart: {
    read: boolean;
    editMyCart: boolean;
    editOtherCart: boolean;
  };
}
