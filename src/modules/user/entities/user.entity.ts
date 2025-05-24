import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { PermissionUser } from '@src/modules/permission/permissionUser.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  permissions: PermissionUser;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.employee)
  ordersEmployee: OrderEntity[];
}
