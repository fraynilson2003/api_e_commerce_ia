import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionRules, RulesPermission } from './rulesPermission.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PermissionGuard } from '../guard/permission.guard';

export function AuthPermission(rules: PermissionRules) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: `PERMISSION: [ type: ${rules.type} ] - [ action: ${rules.action} ]`,
    }),
    RulesPermission(rules),
    UseGuards(AuthGuard, PermissionGuard),
  );
}
