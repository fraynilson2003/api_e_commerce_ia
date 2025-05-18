import { Permissions } from 'src/modules/ability/ability.factory';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 255, unique: false, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, unique: false, nullable: false })
  lastName: string;

  @Column({ type: 'simple-array', default: [] })
  permissions: Permissions[];
}
