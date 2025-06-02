import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthPermission } from '../permission/decorator/authPermission';
import { LoginUserDto } from './dto/loginUser.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @AuthPermission({
    type: 'user',
    action: 'read',
  })
  async getUserDetail(@Param('id') id: string) {
    return await this.userService.getUserDetail(+id);
  }

  @Post('register')
  async createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Post('login')
  async login(@Body() input: LoginUserDto) {
    return this.userService.login(input);
  }

  @Get()
  @AuthPermission({
    type: 'user',
    action: 'read',
  })
  async findAll() {
    return this.userService.findAll();
  }
}
