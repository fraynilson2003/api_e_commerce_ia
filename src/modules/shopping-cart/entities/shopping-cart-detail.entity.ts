import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCartEntity } from './shopping-cart.entity';
import { ProductEntity } from '@src/modules/product/entities/product.entity';

@Entity('shopping_cart_detail')
export class ShoppingCartDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @ManyToOne(() => ShoppingCartEntity, (s) => s.details, {
    onDelete: 'CASCADE',
  })
  shoppingCart: ShoppingCartEntity;

  @OneToMany(() => ProductEntity, (p) => p.shoppingCartDetail, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
}
