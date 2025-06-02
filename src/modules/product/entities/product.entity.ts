import { ShoppingCartDetailEntity } from '@src/modules/shopping-cart/entities/shopping-cart-detail.entity';
import { LinkImage } from 'src/global/LinkImage';
import { OrderDetailEntity } from 'src/modules/order/entities/orderDetail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  stockReserved: number;

  @Column({ type: 'json', nullable: false })
  image: LinkImage;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @OneToMany(() => OrderDetailEntity, (d) => d.product, {
    onDelete: 'CASCADE',
  })
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => ShoppingCartDetailEntity, (d) => d.product, {
    onDelete: 'CASCADE',
  })
  shoppingCartDetail: ShoppingCartDetailEntity[];
}
