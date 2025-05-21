import { SetMetadata } from '@nestjs/common';
import { PermissionEmployee } from '../permissionEmployee.interface';

export const PERMISSION_EMPLOYEE_KEY = 'permission_employee_key';

export type PermissionRules = {
  [K in keyof PermissionEmployee]: {
    type: K;
    action: keyof PermissionEmployee[K];
  };
}[keyof PermissionEmployee]; // ← Esto crea la unión exacta de combinaciones válidas

export const RulesPermissionEmployee = (...requirements: PermissionRules[]) =>
  SetMetadata(PERMISSION_EMPLOYEE_KEY, requirements);
