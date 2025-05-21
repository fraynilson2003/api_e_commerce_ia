import { UserEntity } from './entities/user.entity';

export type UserToken = Pick<UserEntity, 'id' | 'email' | 'isAdmin'>;
