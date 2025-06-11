import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreatePaymentAttemptDto } from './dto/create-payment-attempt.dto';
import { ActiveUser } from '@src/global/active-user.decorator';
import { UserToken } from '../user/userToken.interface';
import { AuthPermission } from '../permission/decorator/authPermission';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MERCADOPAGO_WEBHOOK_SECRET } from '@src/config/keyEnviroments';

@Controller('order')
export class OrderController {
  private mercadoPagoWebhookSecret: string;

  constructor(
    private readonly orderService: OrderService,
    private configService: ConfigService,
  ) {
    this.mercadoPagoWebhookSecret = this.configService.get<string>(
      MERCADOPAGO_WEBHOOK_SECRET,
    )!;
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.orderService.getById(Number(id));
  }

  @Post('payment-attempt')
  @AuthPermission({
    type: 'order',
    action: 'createMyOrder',
  })
  async createPreOrder(
    @Body() input: CreatePaymentAttemptDto,
    @ActiveUser() user: UserToken,
  ) {
    return await this.orderService.createPaymentAttempt(input, user.id);
  }

  @Post('confirm')
  @AuthPermission({
    type: 'order',
    action: 'createMyOrder',
  })
  async confirmOrder(@Body() input: ConfirmOrderDto) {
    return await this.orderService.confirmOrder(input);
  }

  @Post('confirm/webhook/stripe')
  @HttpCode(HttpStatus.OK)
  async webhookStripePagoPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.orderService.webhookStripePagoPayment(
      req,
      res,
      signature,
    );
  }

  @Post('confirm/webhook/mercado-pago')
  @HttpCode(HttpStatus.OK)
  async webhookConfirmMercagoPagoPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-signature') xSignature: string,
    @Headers('x-request-id') xRequestId: string,
  ) {
    const dataID = req.query['data.id'] as string; // viene en la URL
    const parts = xSignature?.split(',') ?? [];

    let ts: string | undefined;
    let hash: string | undefined;

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key.trim() === 'ts') ts = value.trim();
      if (key.trim() === 'v1') hash = value.trim();
    }

    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

    const computedHash = createHmac('sha256', this.mercadoPagoWebhookSecret)
      .update(manifest)
      .digest('hex');

    if (computedHash !== hash) {
      console.warn('❌ Firma inválida de Mercado Pago');
      throw new UnauthorizedException('');
    }

    // ✅ Firma verificada: continuar
    return this.orderService.webhookConfirmMercagoPagoPayment(req, res);
  }
}
