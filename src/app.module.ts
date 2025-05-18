import { Module } from '@nestjs/common';
import { dbConfig } from './config/database';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { APP_FILTER } from '@nestjs/core';
import { TypeORMExceptionFilter } from './global/customExecption';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [dbConfig, ProductModule, CategoryModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
  ],
})
export class AppModule {}
