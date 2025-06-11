import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CLIENT_DOMAIN,
  MERCADOPAGO_ACCESS_TOKEN,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '@src/config/keyEnviroments';
import Decimal from 'decimal.js';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentService {
  private stripeSecret: string;
  public stripe: Stripe;
  public stripeWebhookSecret: string;

  private mercadoPago: MercadoPagoConfig;
  private mercadoPagoAccessToken: string;
  public clientDomain: string;

  constructor(private readonly configService: ConfigService) {
    // Stripe config
    this.stripeSecret = this.configService.get<string>(STRIPE_SECRET_KEY)!;
    this.stripeWebhookSecret = this.configService.get<string>(
      STRIPE_WEBHOOK_SECRET,
    )!;
    this.stripe = new Stripe(this.stripeSecret, {
      apiVersion: '2025-05-28.basil',
    });

    // Mercado Pago config
    this.mercadoPagoAccessToken = this.configService.get<string>(
      MERCADOPAGO_ACCESS_TOKEN,
    )!;

    this.mercadoPago = new MercadoPagoConfig({
      accessToken: this.mercadoPagoAccessToken,
    });

    this.clientDomain = this.configService.get<string>(CLIENT_DOMAIN)!;
  }

  // Stripe
  async createStripePaymentAttempt(
    amount: number,
    orderId: number,
    description?: string,
  ) {
    const amountInCents = new Decimal(amount)
      .mul(100)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      description,
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

  // Mercado Pago
  async createMercadoPagoPreference(
    amount: number,
    orderId: number,
    description?: string,
  ) {
    const preference = new Preference(this.mercadoPago);

    const amountInCents = new Decimal(amount)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();

    const payment = await preference.create({
      body: {
        items: [
          {
            id: orderId.toString(),
            title: `Orden ${orderId}`,
            quantity: 1,
            unit_price: amountInCents,
            currency_id: 'PEN',
          },
        ],
        metadata: {
          orderId: orderId.toString(),
          description: description,
        },
        back_urls: {
          success: `${this.clientDomain}/order/${orderId}`,
          failure: `${this.clientDomain}/order/${orderId}`,
          pending: `${this.clientDomain}/order/${orderId}`,
        },
      },
    });

    return payment;
  }
}
