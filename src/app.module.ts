import { Module } from '@nestjs/common'; 
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { DevicesModule } from './devices/devices.module'; 
import { UploadModule } from './upload/upload.module';
import { TakeawayInforModule } from './takeaway-infor/takeaway-infor.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule, 
    UsersModule, 
    AuthModule, 
    DevicesModule, UploadModule, TakeawayInforModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
