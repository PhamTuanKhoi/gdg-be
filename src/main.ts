import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Bật chuyển đổi kiểu dữ liệu
      // whitelist: true, // Chỉ giữ lại các thuộc tính được định nghĩa trong DTO
      // forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không được định nghĩa
    }),
  );

  // Cho phép truy cập file trong thư mục uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('Device example')
    .setDescription('The Device API description')
    .setVersion('1.0')
    .addTag('Device')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
