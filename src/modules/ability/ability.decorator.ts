import { SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from './ability.factory';

export interface RequireRule {
  actions: Actions;
  subject: Subjects;
}

export const CHECK_ABILITY_KEY = 'check_ability_key';

export const CheckAbilities = (...requirements: RequireRule[]) =>
  SetMetadata(CHECK_ABILITY_KEY, requirements);
