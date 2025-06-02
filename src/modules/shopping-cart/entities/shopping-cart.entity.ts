import { UserEntity } from '@src/modules/user/entities/user.entity';
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShoppingCartDetailEntity } from './shopping-cart-detail.entity';

@Entity('shopping_cart')
export class ShoppingCartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.shoppingCart, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => ShoppingCartDetailEntity, (detail) => detail.shoppingCart, {
    onDelete: 'CASCADE',
  })
  details: ShoppingCartDetailEntity[];
}
