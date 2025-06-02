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
import { CreatePreOrderDto } from './dto/create-preorder.dto';
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

  @Post('pre-order')
  @AuthPermission({
    type: 'order',
    action: 'createMyOrder',
  })
  async createPreOrder(
    @Body() input: CreatePreOrderDto,
    @ActiveUser() user: UserToken,
  ) {
    return await this.orderService.createPreOrder(input, user.id);
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
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.orderService.confirmWebhookStripe(req, res, signature);
  }
}
