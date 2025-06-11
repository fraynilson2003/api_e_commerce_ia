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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreatePaymentAttemptDto } from './dto/create-payment-attempt.dto';
import { ActiveUser } from '@src/global/active-user.decorator';
import { UserToken } from '../user/userToken.interface';
import { AuthPermission } from '../permission/decorator/authPermission';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { Request, Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  async confirmOrder(
    @Body() input: ConfirmOrderDto,
    @ActiveUser() user: UserToken,
  ) {
    return await this.orderService.confirmOrder(input, user.id);
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
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.orderService.webhookConfirmMercagoPagoPayment(
      req,
      res,
      signature,
    );
  }
}
