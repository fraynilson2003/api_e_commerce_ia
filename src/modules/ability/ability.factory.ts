import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import {
  createMongoAbility,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  MongoAbility,
  ExtractSubjectType,
} from '@casl/ability';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof UserEntity> | 'all';

export enum Permissions {
  deleteUser = 'deleteUser',
}

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserEntity): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility as unknown as AbilityClass<AppAbility>,
    );

    if (user.isAdmin) {
      can(Actions.Manage, 'all');
    } else {
      can(Actions.Delete, UserEntity, { id: user.id });

      //permisos especiales
      // Tiene permiso especial para borrar a otros
      if (user.permissions.includes(Permissions.deleteUser)) {
        can(Actions.Delete, UserEntity);
      }
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
