import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto implements Partial<UserEntity> {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'juan@gmail.com',
  })
  email: string | undefined;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'jhon',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '*****',
  })
  password: string;

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
  @ApiPropertyOptional({
    type: Boolean,
    example: false,
  })
  isAdmin?: boolean;
}
