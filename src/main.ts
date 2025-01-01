import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  dotenv.config();

  const PORT = Number(process.env.PORT || 3000);

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`************ Server Running on Port ${PORT} ************`);
}
bootstrap();