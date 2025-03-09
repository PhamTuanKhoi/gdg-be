import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/devices/entities/device.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CalibrationTypeEnum } from './enums/calibration.type.enum';
import { Calibration } from './entities/calibration.entity';
import { BaseRepository } from 'src/database/abstract.repository';
import { QueryCalibrationDto } from './dto/query-calibration.dto';

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

  async getLatestCalibrations(dto: QueryCalibrationDto): Promise<object> {
    const { limit, userId } = dto;

    const query = this.calibrationRepository
      .createQueryBuilder('calibration')
      .distinct(true) // Đảm bảo mỗi calibration chỉ xuất hiện một lần
      .leftJoinAndSelect('calibration.calibrationUsers', 'calibrationUsers')
      .leftJoinAndSelect('calibration.device', 'device')
      .select([
        'calibration.id as id',
        'calibration.type as type',
        'calibration.maintenance as maintenance',
        'calibration.calibration as calibration',
        'device.id',
        'device.name_vi',
        'device.name_en',
      ])
      .addSelect(
        `CASE WHEN calibrationUsers.userId = :userId THEN true ELSE false END`,
        'isViewed',
      )
      .setParameter('userId', userId)
      .orderBy('calibration.id', 'DESC')
      .limit(limit); // Dùng .limit() thay vì .take()

    const calibrations = await query.getRawMany();
    return { limit, data: calibrations };
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
