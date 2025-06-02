import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class AddProductCartDetailDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the product to be added to the cart',
  })
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    type: Number,
    description: 'Quantity of the product to be added to the cart',
  })
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

export class AddProductCartDto {
  @ApiProperty({
    type: [AddProductCartDetailDto],
    description: 'List of products to be added to the cart',
  })
  @IsNotEmpty()
  products: AddProductCartDetailDto[];
}
