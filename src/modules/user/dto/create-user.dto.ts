import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto implements Partial<UserEntity> {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    example: 'Jose',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    example: 'Torres',
  })
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  isAdmin?: boolean;
}
