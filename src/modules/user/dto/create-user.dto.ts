import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { PermissionEmployee } from 'src/modules/permission/permissionEmployee.interface';
import { defaultPermissionEmployee } from 'src/modules/permission/defaultUser';

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
  @ApiProperty({
    type: Object,
    example: defaultPermissionEmployee,
  })
  permissions?: PermissionEmployee;

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
    example: false,
  })
  isAdmin?: boolean;
}
