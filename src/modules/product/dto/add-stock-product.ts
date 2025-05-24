import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class ListAdd {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class AddStockProductDto {
  @ApiProperty({ type: [ListAdd] })
  @IsArray()
  @ArrayMinSize(1) // mínimo un producto
  @ValidateNested({ each: true })
  list: ListAdd[];
}
