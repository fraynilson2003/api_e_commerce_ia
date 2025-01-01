import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DB_URL);

export const dbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [__dirname + './../modules/**/entities/*.entity{.ts,.js}'],
  synchronize: true,

  //dropSchema: true,
});
