import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/devices/entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CalibrationRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}
}
