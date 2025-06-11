import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class EditProductCartDetailDto {
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

export class EditProductCartDto {
  @ApiProperty({
    type: [EditProductCartDetailDto],
    description: 'List of products to be added to the cart',
  })
  @IsNotEmpty()
  products: EditProductCartDetailDto[];
}
