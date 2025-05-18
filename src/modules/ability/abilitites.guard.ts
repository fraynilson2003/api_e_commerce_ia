import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, Permissions } from './ability.factory';
import { CHECK_ABILITY_KEY, RequireRule } from './ability.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequireRule[]>(
      CHECK_ABILITY_KEY,
      context.getHandler(),
    );

    // const { user } = context.switchToHttp;
    const user = new UserEntity();
    user.id = 1;
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.isAdmin = false;
    // user.permissions = [Permissions.deleteUser];
    user.permissions = [];

    const ability = this.caslAbilityFactory.defineAbility(user);
    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.actions, rule.subject),
      );

      return Promise.resolve(true);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }

      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }
}
