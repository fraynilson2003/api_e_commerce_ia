import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '@src/config/keyEnviroments';
import Decimal from 'decimal.js';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripeSecret: string;
  public stripe: Stripe;
  public stripeWebhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.stripeSecret = this.configService.get<string>(STRIPE_SECRET_KEY)!;
    this.stripeWebhookSecret = this.configService.get<string>(
      STRIPE_WEBHOOK_SECRET,
    )!;
    this.stripe = new Stripe(this.stripeSecret, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createIntentPayment(
    amount: number,
    orderId: number,
    description: string | undefined = undefined,
  ) {
    const amountInCents = new Decimal(amount)
      .mul(100)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      description: description,
      currency: 'PEN',
      metadata: {
        orderId: orderId,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new InternalServerErrorException(
        'Error a la hora generar metodo de pago',
      );
    }

    return paymentIntent;
  }
}
