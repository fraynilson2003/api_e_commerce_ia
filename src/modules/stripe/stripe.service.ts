import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STRIPE_SECRET_KEY } from '@src/config/keyEnviroments';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripeSecret: string;
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeSecret = this.configService.get<string>(STRIPE_SECRET_KEY)!;
    this.stripe = new Stripe(this.stripeSecret, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createIntentPayment(
    amount: number,
    description: string | undefined = undefined,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      description: description,
      currency: 'PEN',
    });

    if (!paymentIntent.client_secret) {
      throw new InternalServerErrorException(
        'Error a la hora generar metodo de pago',
      );
    }

    return paymentIntent.client_secret;
  }
}
