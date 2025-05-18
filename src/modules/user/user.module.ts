import { Module } from '@nestjs/common';
import { EmployeeService } from './user.service';
import { EmployeeController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AbilityModule],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class UserModule {}
