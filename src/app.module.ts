import { Module } from '@nestjs/common';
import { dbConfig } from './config/database';

@Module({
  imports: [dbConfig],
  controllers: [],
  providers: [],
})
export class AppModule {}
