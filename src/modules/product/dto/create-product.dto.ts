import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductEntity } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto implements Partial<ProductEntity> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    example: 'tornillo',
  })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  @ApiProperty({
    type: String,
    example: 'Tornillo para tuercas',
  })
  description?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    example: '14.50',
  })
  price: number;
}
