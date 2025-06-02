import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetailEntity } from './orderDetail.entity';
import { EstatusOrder } from '../statusOrder.enum';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.ordersEmployee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  employee?: UserEntity;

  @Column({
    type: 'enum',
    enum: EstatusOrder,
  })
  state: EstatusOrder;

  @Column({ type: 'float', nullable: false })
  totalCost: number;

  @Column({ type: 'varchar', nullable: true })
  clientSecretPayment: string;

  @OneToMany(() => OrderDetailEntity, (detail) => detail.order, {
    onDelete: 'CASCADE',
  })
  orderDetails: OrderDetailEntity[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamptz', nullable: true })
  successDate: Date;
}
