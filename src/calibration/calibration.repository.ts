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

  async findDevicesMaintenanceOrCalibration() {
    return await this.deviceRepository
      .createQueryBuilder('device')
      .select([
        'device.id',
        'device.code',
        'device.next',
        'device.maintenanceDate',
        `CASE 
      WHEN DATEDIFF(device.next, CURDATE()) <= device.notification_time THEN 'next'
      WHEN DATEDIFF(device.maintenanceDate, CURDATE()) <= device.notification_time THEN 'maintenanceDate'
    END AS matched_column`,
      ])
      .where('DATEDIFF(device.next, CURDATE()) <= device.notification_time')
      .orWhere(
        'DATEDIFF(device.maintenanceDate, CURDATE()) <= device.notification_time',
      )
      .orderBy('device.id', 'DESC')
      .getRawMany(); // ⚡ Lấy dữ liệu thô để giữ cột matched_column
  }
}
