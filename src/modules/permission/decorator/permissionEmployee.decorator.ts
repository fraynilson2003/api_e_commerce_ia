import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  PermissionRules,
  RulesPermissionEmployee,
} from './rulesPermissionEmployee.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermissionEmployeeGuard } from '../guard/permissionEmployee.guard';

export function PermissionEmployee(rules: PermissionRules) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: `PERMISSION: [ type: ${rules.type} ] - [ action: ${rules.action} ]`,
    }),
    RulesPermissionEmployee(rules),
    UseGuards(AuthGuard, PermissionEmployeeGuard),
  );
}
