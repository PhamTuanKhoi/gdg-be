import { Module } from '@nestjs/common';
import { DeviceMediasService } from './device-medias.service';
import { DeviceMediasController } from './device-medias.controller';

@Module({
  controllers: [DeviceMediasController],
  providers: [DeviceMediasService],
})
export class DeviceMediasModule {}
