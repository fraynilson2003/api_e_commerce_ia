import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PermissionEmployee } from '../permission/decorator/permissionEmployee.decorator';
import { LoginUserDto } from './dto/loginUser.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @PermissionEmployee({
    type: 'user',
    action: 'create',
  })
  async createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }

  @Post('login')
  async login(@Body() input: LoginUserDto) {
    return this.userService.login(input);
  }

  @Get()
  @PermissionEmployee({
    type: 'user',
    action: 'read',
  })
  async findAll() {
    return this.userService.findAll();
  }
}
