import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  dotenv.config();

  const PORT = Number(process.env.PORT || 4000);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Remueve propiedades que no están en el DTO
      forbidNonWhitelisted: false, // Lanza una excepción si se envían propiedades no definidas en el DTO
      transform: true, // Transforma la entrada a su tipo correspondiente según el DTO
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API e-commerce ia')
    .setDescription('api de e-commerce asistido con ia')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT);
  console.log(`************ Server Running on Port ${PORT} ************`);
}
bootstrap();
