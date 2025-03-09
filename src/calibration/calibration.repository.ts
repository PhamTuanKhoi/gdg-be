import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/devices/entities/device.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CalibrationTypeEnum } from './enums/calibration.type.enum';
import { Calibration } from './entities/calibration.entity';
import { BaseRepository } from 'src/database/abstract.repository';

@Injectable()
export class CalibrationRepository extends BaseRepository<Calibration> {
  constructor(
    @InjectRepository(Calibration)
    private readonly calibrationRepository: Repository<Calibration>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
    super(calibrationRepository);
  }

  async findDevicesMaintenanceOrCalibration() {
    const rawQuery = `
      SELECT DISTINCT
          d.id,
          d.code,
          d.next,
          d.notification_time,
          d.maintenanceDate,
          'next' AS type
      FROM 
          nestjs_typeorm.device d
      LEFT JOIN 
          nestjs_typeorm.calibration c ON d.id = c.deviceId 
          AND c.type = '${CalibrationTypeEnum.CALIBRATION}'
      WHERE 
          DATEDIFF(d.next, CURDATE()) <= d.notification_time 
          AND (c.calibration IS NULL OR d.next != c.calibration)

      UNION

      SELECT DISTINCT
          d.id,
          d.code,
          d.next,
          d.notification_time,
          d.maintenanceDate,
          'maintenanceDate' AS type
      FROM 
          nestjs_typeorm.device d
      LEFT JOIN 
          nestjs_typeorm.calibration c ON d.id = c.deviceId 
          AND c.type = '${CalibrationTypeEnum.MAINTENANCE}'
      WHERE 
          DATEDIFF(d.maintenanceDate, CURDATE()) <= d.notification_time 
          AND (c.maintenance IS NULL OR d.maintenanceDate != c.maintenance)
      ORDER BY 
          id ASC;
    `;

    return await this.deviceRepository.query(rawQuery);
  }

  async saveMany(entity: DeepPartial<Calibration>[]): Promise<Calibration[]> {
    return this.repository.save(entity) as Promise<Calibration[]>;
  }
}
