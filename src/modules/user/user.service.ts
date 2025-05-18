import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(input: CreateUserDto) {
    const create = this.userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      isAdmin: input.isAdmin ?? false,
    });

    return this.userRepository.save(create);
  }

  async findAll() {
    return this.userRepository.find();
  }
}
