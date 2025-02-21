import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DeviceRepository } from './devices.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceRepository],
})
export class DevicesModule {}
