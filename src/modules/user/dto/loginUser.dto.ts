import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'username or email',
  })
  email: string | undefined;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '*****',
  })
  password: string;
}
