import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetailEntity } from './orderDetail.entity';
import { StatusOrder } from '../statusOrder.enum';
import { PaymentMethod } from '../enum/payment-method.enum';

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
    enum: StatusOrder,
  })
  state: StatusOrder;

  @Column({ type: 'float', nullable: false })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  paymentReferenceId?: string;

  @Column({ type: 'text', nullable: true })
  paymentReference?: string;

  @OneToMany(() => OrderDetailEntity, (detail) => detail.order, {
    onDelete: 'CASCADE',
  })
  orderDetails: OrderDetailEntity[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamptz', nullable: true })
  successDate: Date;
}
