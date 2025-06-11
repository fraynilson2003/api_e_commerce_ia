import { Body, Controller, Get, Put } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { UserToken } from '../user/userToken.interface';
import { ActiveUser } from '@src/global/active-user.decorator';
import { EditProductCartDto } from './dto/edit-product-cart.dto';
import { AuthPermission } from '../permission/decorator/authPermission';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get('my-cart')
  @AuthPermission({
    type: 'shoppingCart',
    action: 'read',
  })
  async getCartByUserId(@ActiveUser() userToken: UserToken) {
    return this.shoppingCartService.getCartByUserId(+userToken.id);
  }

  @Put('edit-product')
  @AuthPermission({
    type: 'shoppingCart',
    action: 'editMyCart',
  })
  async addProductCart(
    @Body() input: EditProductCartDto,
    @ActiveUser() userToken: UserToken,
  ) {
    return this.shoppingCartService.editProductCart(+userToken.id, input);
  }
}
