import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductEntity } from '../entities/product.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    type: Number,
    example: 14.5,
  })
  price: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  image?: any;
}
