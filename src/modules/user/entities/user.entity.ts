import { PermissionEmployee } from 'src/modules/permission/permissionEmployee.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', select: false })
  salt: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 255, unique: false, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 255, unique: false, nullable: false })
  lastName: string;

  @Column({ type: 'json', nullable: false })
  permissions: PermissionEmployee;
}
