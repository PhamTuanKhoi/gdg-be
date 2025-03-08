import { Module } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { CalibrationController } from './calibration.controller';
import { CalibrationRepository } from './calibration.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { Device } from 'src/devices/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceMedia])],
  controllers: [CalibrationController],
  providers: [CalibrationService, CalibrationRepository],
})
export class CalibrationModule {}
