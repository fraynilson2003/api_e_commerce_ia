import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Actions } from '../ability/ability.factory';
import { UserEntity } from './entities/user.entity';
import { CheckAbilities } from '../ability/ability.decorator';
import { AbilitiesGuard } from '../ability/abilitites.guard';

@ApiTags('user')
@Controller('user')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async createUser(@Body() input: CreateUserDto) {
    return this.employeeService.createUser(input);
  }

  @Get()
  @CheckAbilities({ actions: Actions.Delete, subject: UserEntity })
  @UseGuards(AbilitiesGuard)
  async findAll() {
    return this.employeeService.findAll();
  }
}
