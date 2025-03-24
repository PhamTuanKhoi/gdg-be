import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';
import { Brackets, Repository } from 'typeorm';
import { BaseRepository } from 'src/database/abstract.repository';
import { DeviceInOut } from 'src/infor-movements/entities/device-in-out.entity';
import { DeviceCalibrationEnum } from './enums/device.calibration.enum';
import { DeviceHistoryQueryDto } from './dto/query-history.dto';

@Injectable()
export class DevicesRepository extends BaseRepository<Device> {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceMedia)
    private readonly mediaRepository: Repository<DeviceMedia>,
    @InjectRepository(DeviceInOut)
    private readonly deviceInOutRepository: Repository<DeviceInOut>,
  ) {
    super(deviceRepository);
  }

  async findAll({ query, order, key, pageIndex = 1, pageSize = 3, status, type }: DeviceQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: Device[];
  }> {
    const queryBuilder = this.deviceRepository.createQueryBuilder('device');

    queryBuilder.leftJoinAndSelect('device.medias', 'medias');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('device.code LIKE :query', { query: `%${query}%` })
            .orWhere('device.name_vi LIKE :query', { query: `%${query}%` })
            .orWhere('device.name_en LIKE :query', { query: `%${query}%` })
            .orWhere('device.manufacturer LIKE :query', { query: `%${query}%` })
            .orWhere('device.serial LIKE :query', { query: `%${query}%` })
            .orWhere('device.model LIKE :query', { query: `%${query}%` });
        }),
      );
    }

    if (status?.toString() && status.toString() !== '') {
      queryBuilder.andWhere('device.status = :status', { status });
    }

    if (type && type.length > 0) {
      queryBuilder.andWhere('device.type IN (:...type)', { type });
    }

    if (key && order) {
      queryBuilder.orderBy(`device.${key}`, order?.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('device.id', 'ASC');
    }

    queryBuilder.andWhere('device.deletedAt IS NULL');
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }

  async findAllCalibration({ query, order, key, pageIndex = 1, pageSize = 10, statusFilter }: DeviceQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: any[]; // Dữ liệu thô, bao gồm medias dưới dạng mảng
  }> {
    // Xây dựng điều kiện WHERE và tham số
    const whereConditions: string[] = [];
    const queryParams: string[] = [];

    if (query) {
      whereConditions.push('(d.name_vi LIKE ? OR d.name_en LIKE ?)');
      queryParams.push(`%${query}%`, `%${query}%`);
    }

    if (statusFilter) {
      switch (statusFilter) {
        case DeviceCalibrationEnum.OVERDUE:
          whereConditions.push('DATEDIFF(d.next, CURDATE()) < 0');
          break;
        case DeviceCalibrationEnum.NEAR_DUE:
          whereConditions.push(
            'DATEDIFF(d.next, CURDATE()) <= d.notification_time AND DATEDIFF(d.next, CURDATE()) >= 0',
          );
          break;
        case DeviceCalibrationEnum.UPCOMING:
          whereConditions.push('DATEDIFF(d.next, CURDATE()) > d.notification_time');
          break;
      }
    }

    whereConditions.push(`d.deletedAt IS NULL`);
    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const orderClause = await this.validKeyDeviceCalibration(key, order);

    const limitOffset = `LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize}`;

    // Truy vấn chính: Thêm cột maintenance và sắp xếp theo nó
    const rawQuery = `
      SELECT
        d.id,
        d.code,
        d.name_vi,
        d.name_en,
        d.serial,
        d.last,
        d.next,
        d.certificate,
        d.notification_time,
        d.maintenanceDate,
        d.type,
        d.period,
        d.status,
        CASE
          WHEN DATEDIFF(d.next, CURDATE()) < 0 THEN '${DeviceCalibrationEnum.OVERDUE}'
          WHEN DATEDIFF(d.next, CURDATE()) <= d.notification_time THEN '${DeviceCalibrationEnum.NEAR_DUE}'
          ELSE '${DeviceCalibrationEnum.UPCOMING}'
        END AS calibrationStatus,
        DATEDIFF(d.maintenanceDate, CURDATE()) AS maintenance, 
        IFNULL(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', dm.id,
              'media', dm.media
            )
          ), '[]'
        ) AS medias
      FROM
        nestjs_typeorm.device d
      LEFT JOIN
        nestjs_typeorm.device_media dm ON dm.deviceId = d.id
      ${whereClause}
      GROUP BY
        d.id
      ${orderClause}
      ${limitOffset};
    `;

    // Truy vấn đếm tổng số bản ghi
    const countQuery = `
      SELECT COUNT(DISTINCT d.id) AS total
      FROM nestjs_typeorm.device d
      ${whereClause};
    `;

    // In truy vấn để debug
    // console.log('rawQuery:', rawQuery);
    // console.log('queryParams:', queryParams);

    // Thực thi truy vấn
    const [data, countResult] = await Promise.all([
      this.deviceRepository.query(rawQuery, queryParams),
      this.deviceRepository.query(countQuery, queryParams),
    ]);

    const total = parseInt(countResult[0].total, 10);

    const parsedData = data.map((item) => ({
      ...item,
      medias: (JSON.parse(item?.medias) || [])?.filter((i) => i?.id != null) || [],
    }));

    return {
      total,
      pageIndex: +pageIndex,
      pageSize: +pageSize,
      data: parsedData,
    };
  }

  async validKeyDeviceCalibration(key, order): Promise<string> {
    const validKeys = [
      'id',
      'code',
      'name_vi',
      'name_en',
      'manufacturer',
      'model',
      'serial',
      'place',
      'location',
      'last',
      'next',
      'certificate',
      'notification_time',
      'maintenanceDate',
      'description',
      'type',
      'period',
      'status',
      'maintenance',
    ];
    if (key && !validKeys.includes(key)) {
      throw new BadRequestException(`Invalid sort key: ${key}`);
    }

    let orderClause = '';
    if (key && order) {
      const sortField = key === 'maintenance' ? 'maintenance' : `d.${key}`;
      // Sắp xếp theo key chính, sau đó theo id làm tiêu chí phụ
      orderClause = `ORDER BY ${sortField} ${order.toUpperCase()}, d.id ASC`;
    } else {
      // Mặc định: maintenance trước, id sau
      orderClause = `ORDER BY maintenance ASC, d.id ASC`;
    }

    return orderClause;
  }

  async findByHistory(
    id: number,
    { query, order = 'asc', key = 'id', pageIndex = 1, pageSize = 10, date }: DeviceHistoryQueryDto,
  ) {
    const queryBuilder = this.deviceInOutRepository
      .createQueryBuilder('deviceInOut')
      // Select specific fields from DeviceInOut
      .select([
        'deviceInOut.id',
        'deviceInOut.createdAt',
        'deviceInOut.updatedAt',
        'deviceInOut.dateIn',
        'deviceInOut.dateOut',
      ])
      // Join infoMovement without selecting the whole thing, just select specific columns
      .leftJoin('deviceInOut.inforMovement', 'inforMovement')
      .addSelect(['inforMovement.id', 'inforMovement.ownerName', 'inforMovement.location', 'inforMovement.toLocation'])
      // Join device without selecting the whole thing, just select specific columns
      .leftJoin('deviceInOut.device', 'device')
      .addSelect(['device.id', 'device.code', 'device.name_en', 'device.name_vi'])
      // Join medias (get all)
      // .leftJoinAndSelect('device.medias', 'medias')
      // Join removingTech without selecting all, just select name
      .leftJoin('inforMovement.removingTech', 'removingTech')
      .addSelect(['removingTech.id', 'removingTech.name'])
      // Join returningTech (if needed)
      .leftJoin('inforMovement.returningTech', 'returningTech')
      .addSelect(['returningTech.id', 'returningTech.name'])
      .where('device.id = :deviceId', { deviceId: id });

    // Thêm điều kiện lọc theo khoảng thời gian dateIn và dateOut
    if (date && date.length >= 2) {
      const startDate = date[0];
      const endDate = date[1];
      queryBuilder.andWhere(
        `(deviceInOut.dateIn BETWEEN :startDate AND :endDate 
          OR deviceInOut.dateOut BETWEEN :startDate AND :endDate)`,
        { startDate, endDate },
      );
    }

    if (query) {
      queryBuilder.andWhere(
        `(inforMovement.ownerName LIKE :query 
          OR inforMovement.location LIKE :query 
          OR inforMovement.toLocation LIKE :query 
          OR removingTech.name LIKE :query 
          OR returningTech.name LIKE :query)`,
        {
          query: `%${query}%`,
        },
      );
    }

    // Check for valid key
    const validKeys = ['id', 'createdAt', 'updatedAt', 'dateIn', 'dateOut'];
    const orderKey = validKeys.includes(key) ? key : 'id';

    queryBuilder.orderBy(`deviceInOut.${orderKey}`, order ? (order.toUpperCase() as 'ASC' | 'DESC') : 'ASC');

    const skip = (pageIndex - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    try {
      // console.log('Generated SQL:', queryBuilder.getSql()); // Debug SQL
      const [results, total] = await queryBuilder.getManyAndCount();

      return {
        data: results,
        total,
        pageIndex,
        pageSize,
      };
    } catch (error) {
      console.error('Lỗi khi thực thi truy vấn:', error);
      throw error;
    }
  }

  async findByIdRelation(id: number): Promise<Device> {
    return await this.deviceRepository.findOne({
      where: { id },
      relations: ['medias'],
      withDeleted: false,
    });
  }

  // async findByHistory(id: number): Promise<Device> {
  //   const device = await this.deviceRepository.findOne({
  //     where: { id },
  //     relations: [
  //       'medias',
  //       'deviceInOuts',
  //       'deviceInOuts.inforMovement',
  //       'deviceInOuts.inforMovement.removingTech',
  //       'deviceInOuts.inforMovement.returningTech',
  //     ],
  //   });

  //   if (!device) return null;

  //   return device;
  // }

  async saveMedia(media: Partial<DeviceMedia>): Promise<DeviceMedia> {
    return await this.mediaRepository.save(media);
  }

  async findMediaById(id: number): Promise<DeviceMedia | null> {
    return await this.mediaRepository.findOne({ where: { id } });
  }

  async rmoveMedia(media: DeviceMedia): Promise<DeviceMedia | null> {
    return await this.mediaRepository.remove(media);
  }
}
