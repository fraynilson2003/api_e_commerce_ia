import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserToken } from '../../user/userToken.interface';

import { Reflector } from '@nestjs/core';
import {
  PERMISSION_EMPLOYEE_KEY,
  PermissionRules,
} from '../decorator/rulesPermissionEmployee.decorator';

@Injectable()
export class PermissionEmployeeGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserToken;

    const userDetail = await this.userService.findOneUserPermission(user.id);

    if (!userDetail) {
      return false;
    }

    const [rule] = this.reflector.get<PermissionRules[]>(
      PERMISSION_EMPLOYEE_KEY,
      context.getHandler(),
    );

    //si es admin pasa
    if (userDetail.isAdmin) {
      return true;
    }

    //verificamos permisos
    try {
      const result =
        (userDetail.permissions[rule.type][rule.action] as boolean) ?? false;

      if (!result) {
        throw new UnauthorizedException('Permission denied');
      }
      return result;
    } catch (error) {
      throw new UnauthorizedException('Permission denied');
    }
  }
}
