import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreatePreOrderDto } from './dto/create-preorder.dto';
import { ActiveUser } from '@src/global/active-user.decorator';
import { UserToken } from '../user/userToken.interface';
import { PermissionAuth } from '../permission/decorator/permissionAuth.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('pre-order')
  @PermissionAuth({
    type: 'order',
    action: 'createMyOrder',
  })
  create(@Body() input: CreatePreOrderDto, @ActiveUser() user: UserToken) {
    return this.orderService.createPreOrder(input, user.id);
  }
}
