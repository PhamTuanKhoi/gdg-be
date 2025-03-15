import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/abstract.repository';
import { InforMovement } from './entities/infor-movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeviceInOut } from './entities/device-in-out.entity';
import { Device } from 'src/devices/entities/device.entity';
import { InforMovementQueryDto } from './dto/query-infor-movements.dto';

@Injectable()
export class InforMovementsRepository extends BaseRepository<InforMovement> {
  constructor(
    @InjectRepository(InforMovement)
    private readonly inforMovementRepository: Repository<InforMovement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DeviceInOut)
    private readonly deviceInOutRepository: Repository<DeviceInOut>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
    super(inforMovementRepository);
  }

  async findAll({ query, order, key, pageIndex = 1, pageSize = 10 }: InforMovementQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: InforMovement[];
  }> {
    const baseQuery = this.inforMovementRepository
      .createQueryBuilder('inforMovement')
      .leftJoin('inforMovement.deviceInOuts', 'deviceInOut');

    // ✅ Xử lý tìm kiếm
    if (query) {
      baseQuery.andWhere(
        `inforMovement.ownerName LIKE :query 
        OR inforMovement.address LIKE :query 
        OR inforMovement.technician LIKE :query 
        OR inforMovement.location LIKE :query 
        OR inforMovement.toLocation LIKE :query 
        OR inforMovement.signature LIKE :query`,
        { query: `%${query}%` },
      );
    }

    // ✅ Đếm total chính xác (không dùng `GROUP BY`)
    const total = await baseQuery
      .clone()
      .select('COUNT(DISTINCT inforMovement.id)', 'count')
      .getRawOne()
      .then((res) => Number(res.count));

    // ✅ Query lấy dữ liệu (có `GROUP BY`, phân trang đúng)
    const data = await baseQuery
      .leftJoinAndSelect('inforMovement.removingTech', 'removingTech')
      .leftJoinAndSelect('inforMovement.returningTech', 'returningTech')
      .select([
        'inforMovement.id AS id',
        'inforMovement.createdAt AS createdAt',
        'inforMovement.updatedAt AS updatedAt',
        'inforMovement.ownerName AS ownerName',
        'inforMovement.address AS address',
        'inforMovement.technician AS technician',
        'inforMovement.date AS date',
        'inforMovement.toDate AS toDate',
        'inforMovement.location AS location',
        'inforMovement.toLocation AS toLocation',
        'inforMovement.signature AS signature',
        'inforMovement.total AS total',
        'inforMovement.qcVerifyingRemoving AS qcVerifyingRemoving',
        'inforMovement.qcVerifyingReturning AS qcVerifyingReturning',
        'inforMovement.notes AS notes',
        "JSON_OBJECT('id', removingTech.id, 'name', removingTech.name) AS removingTech",
        "JSON_OBJECT('id', returningTech.id, 'name', returningTech.name) AS returningTech",
        'SUM(CASE WHEN deviceInOut.dateIn IS NOT NULL THEN 1 ELSE 0 END) AS totalReturned',
      ])
      .groupBy('inforMovement.id')
      .orderBy(key ? `inforMovement.${key}` : 'inforMovement.createdAt', order?.toUpperCase() as 'ASC' | 'DESC')
      .offset((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }

  async findRelationById(id: number): Promise<InforMovement> {
    return await this.inforMovementRepository.findOne({
      where: { id },
      relations: ['deviceInOuts', 'deviceInOuts.device', 'removingTech', 'returningTech'],
    });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findDeviceByIds(ids: number[]): Promise<Device[]> {
    return await this.deviceRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findDeviceInOutByIds(ids: number[]): Promise<DeviceInOut[]> {
    return await this.deviceInOutRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findDeviceInOutByMovementAndDevices(inforMovementId: number, deviceIds: number[]): Promise<DeviceInOut[]> {
    return await this.deviceInOutRepository.find({
      where: {
        inforMovement: { id: inforMovementId },
        device: In(deviceIds),
      },
      relations: ['device'], // Đảm bảo lấy cả device.id để xử lý Set
    });
  }

  createDeviceInOut(data: Partial<DeviceInOut>): DeviceInOut {
    return this.deviceInOutRepository.create(data);
  }

  async saveDeviceInOuts(entity: DeviceInOut[]): Promise<DeviceInOut[]> {
    return await this.deviceInOutRepository.save(entity);
  }
}
