import { Module } from '@nestjs/common';
import { DeviceMediasService } from './device-medias.service';
import { DeviceMediasController } from './device-medias.controller';
import { DeviceMedia } from './entities/device-media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceMedia])],
  controllers: [DeviceMediasController],
  providers: [DeviceMediasService],
})
export class DeviceMediasModule {}
