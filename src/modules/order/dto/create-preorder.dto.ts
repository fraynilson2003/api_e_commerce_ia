import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

class CreatePreOrderDetailDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  productId: number;
}

export class CreatePreOrderDto {
  @ApiProperty({ type: [CreatePreOrderDetailDto] })
  @IsArray()
  @ArrayMinSize(1) // mínimo un producto
  @ValidateNested({ each: true })
  details: CreatePreOrderDetailDto[];
}
