import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { CreatePaymentAttemptDto } from './dto/create-payment-attempt.dto';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entities/orderDetail.entity';
import { StatusOrder } from './statusOrder.enum';
import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { PaymentMethod } from './enum/payment-method.enum';
import { ShoppingCartDetailEntity } from '../shopping-cart/entities/shopping-cart-detail.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly paymentService: PaymentService,
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

  async createPaymentAttempt(input: CreatePaymentAttemptDto, userId: number) {
    const transaction = await this.orderRepository.manager.transaction(
      async (manager) => {
        const findUser = await manager.findOneByOrFail(UserEntity, {
          id: userId,
        });

        const createOrder = manager.create(OrderEntity, {
          user: findUser,
          state: StatusOrder.RESERVED,
          paymentMethod: input.paymentMethod,
          totalCost: 1,
        });

        let order = await manager.save(createOrder);

        //detalles
        let totalCost = 0;

        //antes de crear la nueva pre orden cancelamos las preordenes anteriores
        const lastOrders = await manager.find(OrderEntity, {
          where: {
            user: {
              id: userId,
            },
            state: StatusOrder.RESERVED,
          },
          relations: {
            user: true,
            orderDetails: {
              product: true,
            },
          },
        });

        //cambiamos estado y liberamos stock
        for (let index = 0; index < lastOrders.length; index++) {
          const ord = lastOrders[index];
          ord.state = StatusOrder.CANCELLED;

          await manager.save(ord);
          await Promise.all(
            ord.orderDetails.map(async (det) => {
              const product = await manager.findOneOrFail(ProductEntity, {
                where: {
                  id: det.product.id,
                },
              });

              //avisar a los trabajadores y desarrolladores si se llega a dar este error
              if (product.stockReserved < det.quantity) {
                throw new ConflictException(
                  'Error in quantuty stock reserverd',
                );
              }

              product.stockQuantity += det.quantity;
              product.stockReserved -= det.quantity;

              await manager.save(product);
            }),
          );
        }

        const findDetails = await manager.find(ShoppingCartDetailEntity, {
          where: {
            shoppingCart: {
              user: {
                id: userId,
              },
            },
          },
          relations: {
            shoppingCart: {
              user: true,
            },
            product: true,
          },
        });

        await Promise.all(
          findDetails.map(async (detail) => {
            const product = await manager.findOneByOrFail(ProductEntity, {
              id: detail.product.id,
            });
            //precio
            const formatPrice = product.price * 10;
            totalCost += formatPrice * detail.quantity;
            //stock y verificacion de stock
            if (product.stockQuantity < detail.quantity) {
              throw new ConflictException('Insufficient stock');
            }

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

        //creamos clave de pago dependiendo del método de pago
        const formatTotalCost = parseFloat((totalCost / 10).toFixed(2));
        if (input.paymentMethod === PaymentMethod.STRIPE) {
          const secretPayment =
            await this.paymentService.createStripePaymentAttempt(
              formatTotalCost,
              order.id,
            );
          if (!secretPayment.client_secret) {
            throw new InternalServerErrorException(
              'Error creando pago para stripe',
            );
          }
          order.paymentReferenceId = secretPayment.id;
          order.paymentReference = secretPayment.client_secret;
        } else if (input.paymentMethod === PaymentMethod.MERCADOPAGO) {
          const preferenceResponse =
            await this.paymentService.createMercadoPagoPreference({
              amount: formatTotalCost,
              orderId: order.id,
            });

          order.paymentReferenceId = preferenceResponse.id;
          order.paymentReference = preferenceResponse.init_point;
        }

        //actualizamos el total de la orden

        order.totalCost = formatTotalCost;
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

  async confirmOrder(input: ConfirmOrderDto) {
    const transaction = await this.orderRepository.manager.transaction(
      async (manager) => {
        const findOrder = await manager.findOne(OrderEntity, {
          where: {
            id: input.orderId,
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

        findOrder.state = StatusOrder.SUCCESS;
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

  async webhookStripePagoPayment(
    req: Request,
    res: Response,
    signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.paymentService.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.paymentService.stripeWebhookSecret,
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

  async webhookConfirmMercagoPagoPayment(req: Request, res: Response) {
    try {
      const rawBody = req.body;
      const parsedBody = JSON.parse(rawBody.toString('utf-8'));
      const paymentId = parsedBody?.data?.id;

      if (!paymentId) {
        return res.status(400).json({ error: 'Invalid payment ID' });
      }

      const paymentData =
        await this.paymentService.getPaymentByIdForMercadoPago(paymentId); // Debe llamar a /v1/payments/:id con el token

      console.log('**********************paymentData');
      console.log(paymentData);

      if (
        paymentData?.status === 'approved' &&
        paymentData?.metadata?.order_id
      ) {
        const orderId = parseInt(paymentData.metadata.order_id);

        await this.confirmOrder({ orderId }); // Asegurate de guardar userId en metadata

        console.log(`✅ Orden ${orderId} confirmada por MercadoPago`);
      } else {
        console.log(`⚠️ Pago ${paymentId} no aprobado o sin metadata`);
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('⚠️  Error en Webhook MercadoPago:', err.message);
      return res.status(500).send('Internal server error');
    }
  }
}
