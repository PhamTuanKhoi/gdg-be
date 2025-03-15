import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/devices/entities/device.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CalibrationTypeEnum } from './enums/calibration.type.enum';
import { Calibration } from './entities/calibration.entity';
import { BaseRepository } from 'src/database/abstract.repository';
import { QueryCalibrationDto } from './dto/query-calibration.dto';
import { User } from 'src/users/entities/user.entity';
import { CalibrationUser } from './entities/calibration-user.entity';

@Injectable()
export class CalibrationRepository extends BaseRepository<Calibration> {
  constructor(
    @InjectRepository(Calibration)
    private readonly calibrationRepository: Repository<Calibration>,
    @InjectRepository(CalibrationUser)
    private readonly calibrationUserRepository: Repository<CalibrationUser>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(calibrationRepository);
  }

  async getLatestCalibrations(dto: QueryCalibrationDto): Promise<object> {
    const { pageSize, pageIndex, userId, query, order, key, isViewed } = dto;
    const offset = (pageIndex - 1) * pageSize;

    const queryBuilder = this.calibrationRepository
      .createQueryBuilder('calibration')
      .leftJoinAndSelect('calibration.device', 'device')
      .select([
        'calibration.id as id',
        'calibration.type as type',
        'calibration.maintenance as maintenance',
        'calibration.calibration as calibration',
        'calibration.createdAt as createdAt',
        'device.id',
        'device.name_vi',
        'device.name_en',
      ])
      .addSelect(
        `EXISTS (
          SELECT 1 
          FROM calibration_user cu 
          WHERE cu.calibrationId = calibration.id 
          AND cu.userId = :userId
        )`,
        'isViewed',
      )
      .setParameter('userId', userId);

    if (query) {
      queryBuilder.andWhere(`(device.name_vi LIKE :query OR device.name_en LIKE :query)`, { query: `%${query}%` });
    }

    // Thêm điều kiện lọc theo isViewed
    if (isViewed !== undefined) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 
          FROM calibration_user cu 
          WHERE cu.calibrationId = calibration.id 
          AND cu.userId = :userId
        ) = :isViewed`,
        { isViewed },
      );
    }

    const validKeys = ['id', 'createdAt', 'type', 'maintenance', 'calibration', 'isViewed'];
    const orderKey = validKeys.includes(key) ? key : 'id';
    const orderDirection: 'ASC' | 'DESC' = order === 'asc' ? 'ASC' : 'DESC';

    if (orderKey === 'isViewed') {
      queryBuilder.orderBy('isViewed', orderDirection);
    } else {
      queryBuilder.orderBy(`calibration.${orderKey}`, orderDirection);
    }

    queryBuilder.limit(pageSize).offset(offset);

    try {
      const [calibrations, total] = await Promise.all([queryBuilder.getRawMany(), queryBuilder.getCount()]);

      return {
        pageIndex,
        pageSize,
        total,
        data: calibrations,
      };
    } catch (error) {
      console.error('Lỗi khi thực thi truy vấn:', error);
      throw error;
    }
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
      WHERE
          DATEDIFF(d.next, CURDATE()) <= d.notification_time
          AND NOT EXISTS (
              SELECT 1
              FROM nestjs_typeorm.calibration c
              WHERE c.deviceId = d.id
              AND c.type = '${CalibrationTypeEnum.CALIBRATION}'
              AND c.calibration = d.next
          )

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
      WHERE
          DATEDIFF(d.maintenanceDate, CURDATE()) <= d.notification_time
          AND NOT EXISTS (
              SELECT 1
              FROM nestjs_typeorm.calibration c
              WHERE c.deviceId = d.id
              AND c.type = '${CalibrationTypeEnum.MAINTENANCE}'
              AND c.maintenance = d.maintenanceDate
          )
      ORDER BY
          id ASC;
    `;

    return await this.deviceRepository.query(rawQuery);
  }

  async saveMany(entity: DeepPartial<Calibration>[]): Promise<Calibration[]> {
    return this.repository.save(entity) as Promise<Calibration[]>;
  }

  async findUserById(userId: number): Promise<User> {
    if (!userId || userId == null) return;
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async createAndSaveCalibrationUser(entityData: DeepPartial<CalibrationUser>): Promise<CalibrationUser> {
    const entity = this.calibrationUserRepository.create(entityData);
    return (await this.calibrationUserRepository.save(entity)) as CalibrationUser;
  }

  async findCalibrationByDeviceNext(type: CalibrationTypeEnum, next: Date, deviceId: number): Promise<Calibration> {
    return await this.calibrationRepository.findOne({
      where: {
        device: { id: deviceId },
        calibration: next,
        type,
      },
    });
  }

  async findCalibrationByDeviceMaintenance(
    type: CalibrationTypeEnum,
    maintenanceDate: Date,
    deviceId: number,
  ): Promise<Calibration> {
    return await this.calibrationRepository.findOne({
      where: {
        device: { id: deviceId },
        maintenance: maintenanceDate,
        type,
      },
    });
  }
}
