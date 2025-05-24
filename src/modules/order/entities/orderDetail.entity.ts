import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';

@Entity('order_detail')
export class OrderDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float', nullable: true })
  priceSell: number;

  @ManyToOne(() => ProductEntity, (p) => p.orderDetails)
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  order: OrderEntity;
}
