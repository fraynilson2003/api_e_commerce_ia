import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { PermissionUser } from '@src/modules/permission/permissionUser.interface';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCartEntity } from '@src/modules/shopping-cart/entities/shopping-cart.entity';

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

  @OneToMany(() => OrderEntity, (order) => order.user, {
    onDelete: 'CASCADE',
  })
  orders: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.employee, {
    onDelete: 'CASCADE',
  })
  ordersEmployee: OrderEntity[];

  @OneToOne(() => ShoppingCartEntity, (s) => s.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  shoppingCart: ShoppingCartEntity;
}
