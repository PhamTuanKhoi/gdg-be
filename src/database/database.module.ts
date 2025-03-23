import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true, // 🚨 Tắt synchronize
        // migrations: ['dist/migrations/*.js'],
        migrationsRun: true, // 🚀 Tự động chạy migration khi khởi động
        logging: false,
        timezone: 'Asia/Ho_Chi_Minh',
        retryAttempts: 10, // retry 10 time
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
