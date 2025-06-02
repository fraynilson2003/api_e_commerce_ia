import { Body, Controller, Post, Put } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { UserToken } from '../user/userToken.interface';
import { ActiveUser } from '@src/global/active-user.decorator';
import { AddProductCartDto } from './dto/edit-product-cart.dto';
import { AuthPermission } from '../permission/decorator/authPermission';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post('add-product')
  @AuthPermission({
    type: 'shoppingCart',
    action: 'editMyCart',
  })
  async addProductCart(
    @Body() input: AddProductCartDto,
    @ActiveUser() userToken: UserToken,
  ) {
    return this.shoppingCartService.editProductCart(+userToken.id, input);
  }

  @Put('clear')
  @AuthPermission({
    type: 'shoppingCart',
    action: 'editMyCart',
  })
  async clearCart(
    @Body() input: AddProductCartDto,
    @ActiveUser() userToken: UserToken,
  ) {
    return this.shoppingCartService.editProductCart(+userToken.id, input);
  }
}
