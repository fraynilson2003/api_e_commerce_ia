import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmOrderDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  orderId: number;
}
