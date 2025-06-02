import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entities/orderDetail.entity';
import { EstatusOrder } from './statusOrder.enum';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import Stripe from 'stripe';
import { Request, Response } from 'express';

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
        const findUser = await manager.findOneByOrFail(UserEntity, {
          id: userId,
        });

        const createOrder = manager.create(OrderEntity, {
          user: findUser,
          state: EstatusOrder.RESERVED,
          totalCost: 1,
        });

        let order = await manager.save(createOrder);

        //detalles
        let totalCost = 0;

        await Promise.all(
          input.details.map(async (detail) => {
            const product = await manager.findOneByOrFail(ProductEntity, {
              id: detail.productId,
            });
            //precio
            const formatPrice = product.price * 10;
            totalCost += formatPrice * detail.quantity;
            //stock
            product.stockQuantity -= detail.quantity;
            product.stockReserved += detail.quantity;
            await manager.save(product);

            const createDetail = manager.create(OrderDetailEntity, {
              order: {
                id: order.id,
              },
              quantity: detail.quantity,
              priceSell: product.price,
              product: product,
            });

            await manager.save(createDetail);
          }),
        );

        //creamos clave de pago
        const secretPayment = await this.stripeService.createIntentPayment(
          parseFloat((totalCost / 100).toFixed(2)),
          order.id,
        );

        if (!secretPayment.client_secret) {
          throw new InternalServerErrorException(
            'Error creando pago para stripe',
          );
        }

        order.clientSecretPayment = secretPayment.client_secret;
        order.totalCost = parseFloat((totalCost / 100).toFixed(2));
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

  async confirmOrder(input: ConfirmOrderDto, userId: number) {
    const transaction = await this.orderRepository.manager.transaction(
      async (manager) => {
        const findOrder = await manager.findOne(OrderEntity, {
          where: {
            id: input.orderId,
            user: {
              id: userId,
            },
          },
          relations: {
            user: true,
            orderDetails: {
              product: true,
            },
          },
        });

        if (!findOrder) {
          throw new InternalServerErrorException('Error confirmando compra');
        }

        findOrder.state = EstatusOrder.SUCCESS;
        await manager.save(findOrder);

        //modificamos el sotck
        await Promise.all(
          findOrder.orderDetails.map(async (det) => {
            const product = det.product;
            product.stockReserved -= det.quantity;
            await manager.save(product);
          }),
        );

        const orderResponse = await manager.findOneOrFail(OrderEntity, {
          where: {
            id: findOrder.id,
          },
          relations: {
            orderDetails: {
              product: true,
            },
            user: true,
          },
        });

        return orderResponse;
      },
    );

    return transaction;
  }

  async confirmWebhookStripe(req: Request, res: Response, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.stripeService.stripeWebhookSecret,
      );
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar evento específico
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        console.log(`✅ Orden ${orderId} marcada como pagada.`);
      }
    }

    res.send({ received: true });
  }
}
