import { SetMetadata } from '@nestjs/common';
import { PermissionUser } from '../permissionUser.interface';

export const PERMISSION_EMPLOYEE_KEY = 'permission_employee_key';

export type PermissionRules = {
  [K in keyof PermissionUser]: {
    type: K;
    action: keyof PermissionUser[K];
  };
}[keyof PermissionUser]; // ← Esto crea la unión exacta de combinaciones válidas

export const RulesPermission = (...requirements: PermissionRules[]) =>
  SetMetadata(PERMISSION_EMPLOYEE_KEY, requirements);
