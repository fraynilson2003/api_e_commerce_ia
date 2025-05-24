import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entities/orderDetail.entity';
import { EstatusOrder } from './statusOrder.enum';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async getById(id: number) {
    const order = await this.orderRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        user: true,
        orderDetails: true,
      },
    });

    return order;
  }

  async createPreOrder(input: CreatePreOrderDto, userId: number) {
    const transaction = await this.orderRepository.manager.transaction(
      async (manager) => {
        let totalCost = 0;
        //calculamos precio
        await Promise.all(
          input.details.map(async (det) => {
            const product = await manager.findOneByOrFail(ProductEntity, {
              id: det.productId,
            });
            const formatPrice = product.price * 10;
            totalCost += formatPrice * det.quantity;
          }),
        );

        const findUser = await manager.findOneByOrFail(UserEntity, {
          id: userId,
        });

        const createOrder = manager.create(OrderEntity, {
          user: findUser,
          state: EstatusOrder.RESERVED,
          totalCost: parseFloat((totalCost / 100).toFixed(2)),
        });

        let order = await manager.save(createOrder);

        //detalles
        await Promise.all(
          input.details.map(async (detail) => {
            const createDetail = manager.create(OrderDetailEntity, {
              order: {
                id: order.id,
              },
              quantity: detail.quantity,
              product: {
                id: detail.productId,
              },
            });

            await manager.save(createDetail);
          }),
        );

        //creamos clave de pago
        const secretPayment = await this.stripeService.createIntentPayment(
          totalCost / 100,
        );

        order.clientSecretPayment = secretPayment;
        order = await manager.save(order);

        const detail = await manager.findOneOrFail(OrderEntity, {
          where: {
            id: order.id,
          },
          relations: {
            user: true,
            orderDetails: true,
          },
        });

        return detail;
      },
    );

    return transaction;
  }
}
