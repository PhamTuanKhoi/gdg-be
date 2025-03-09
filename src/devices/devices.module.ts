import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DevicesRepository } from './devices.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { DeviceInOut } from 'src/infor-movements/entities/device-in-out.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceMedia, DeviceInOut])],
  controllers: [DevicesController],
  providers: [DevicesService, DevicesRepository],
})
export class DevicesModule {}
