import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import {
  EditProductCartDetailDto,
  EditProductCartDto,
} from './dto/edit-product-cart.dto';
import { ShoppingCartDetailEntity } from './entities/shopping-cart-detail.entity';

@Injectable()
export class ShoppingCartService {
  constructor(private readonly manager: EntityManager) {}

  async getCartByUserId(userId: number) {
    const findCart = await this.manager.findOne(ShoppingCartEntity, {
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        details: {
          product: true,
        },
      },
    });

    if (!findCart) {
      throw new NotFoundException('Cart not found');
    }

    return findCart;
  }

  async editProductCart(userId: number, { products }: EditProductCartDto) {
    const groupedMap = new Map<number, EditProductCartDetailDto>();

    for (const item of products) {
      if (groupedMap.has(item.productId)) {
        groupedMap.get(item.productId)!.quantity += item.quantity;
      } else {
        groupedMap.set(item.productId, { ...item }); // Clon para evitar mutar el original
      }
    }

    const groupedProducts = Array.from(groupedMap.values());

    const transaction = await this.manager.transaction(async (manager) => {
      const findCart = await manager.findOne(ShoppingCartEntity, {
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
          details: true,
        },
      });

      if (!findCart) {
        throw new NotFoundException('Cart not found');
      }

      //traemos los detalles del carrito
      //eliminamos los detalles del carrito
      await manager.delete(ShoppingCartDetailEntity, {
        shoppingCart: findCart.id,
      });

      await Promise.all(
        groupedProducts.map(async (p) => {
          const create = manager.create(ShoppingCartDetailEntity, {
            product: {
              id: p.productId,
            },
            quantity: p.quantity,
            shoppingCart: {
              id: findCart.id,
            },
          });

          await manager.save(create);
        }),
      );

      //traemos el carrito actualizado
      const cartResponse = await manager.findOneOrFail(ShoppingCartEntity, {
        where: {
          id: findCart.id,
        },
        relations: {
          user: true,
          details: {
            product: true,
          },
        },
      });

      //eliminamos los detalles con cantidad 0
      cartResponse.details = cartResponse.details.filter(
        (detail) => detail.quantity > 0,
      );

      return cartResponse;
    });

    return transaction;
  }

  async clearCart(userId: number) {
    const transaction = await this.manager.transaction(async (manager) => {
      const findCart = await manager.findOne(ShoppingCartEntity, {
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
          details: true,
        },
      });

      if (!findCart) {
        throw new NotFoundException('Cart not found');
      }

      //eliminamos los detalles del carrito
      await manager.delete(ShoppingCartDetailEntity, {
        shoppingCart: findCart.id,
      });

      return await manager.findOneOrFail(ShoppingCartEntity, {
        where: {
          id: findCart.id,
        },
        relations: {
          user: true,
          details: {
            product: true,
          },
        },
      });
    });

    return transaction;
  }
}
