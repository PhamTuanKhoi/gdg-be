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

  async findAll({
    query,
    order,
    key,
    pageIndex = 1,
    pageSize = 10,
  }: InforMovementQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: InforMovement[];
  }> {
    const queryBuilder = this.inforMovementRepository
      .createQueryBuilder('inforMovement')
      .leftJoinAndSelect('inforMovement.removingTech', 'removingTech')
      .leftJoinAndSelect('inforMovement.returningTech', 'returningTech')
      .leftJoin('inforMovement.deviceInOuts', 'deviceInOut')
      .select([
        'inforMovement.id AS id',
        'inforMovement.createdAt as createdAt',
        'inforMovement.updatedAt as updatedAt',
        'inforMovement.ownerName as ownerName',
        'inforMovement.address as address',
        'inforMovement.technician as technician',
        'inforMovement.date as date',
        'inforMovement.toDate as toDate',
        'inforMovement.location as location',
        'inforMovement.toLocation as toLocation',
        'inforMovement.signature as signature',
        'inforMovement.total as total',
        'inforMovement.qcVerifyingRemoving as qcVerifyingRemoving',
        'inforMovement.qcVerifyingReturning as qcVerifyingReturning',
        'inforMovement.notes as notes',
        "JSON_OBJECT('id', removingTech.id, 'name', removingTech.name) AS removingTech",
        "JSON_OBJECT('id', returningTech.id, 'name', returningTech.name) AS returningTech",
        'SUM(CASE WHEN deviceInOut.dateIn IS NOT NULL THEN 1 ELSE 0 END) AS totalReturned',
      ])
      .groupBy('inforMovement.id, removingTech.id, returningTech.id');

    // ✅ Thêm điều kiện tìm kiếm (where)
    if (query) {
      queryBuilder.andWhere(
        `inforMovement.ownerName LIKE :query 
      OR inforMovement.address LIKE :query 
      OR inforMovement.technician LIKE :query 
      OR inforMovement.location LIKE :query 
      OR inforMovement.toLocation LIKE :query 
      OR inforMovement.signature LIKE :query`,
        { query: `%${query}%` },
      );
    }

    // ✅ Sắp xếp
    if (key) {
      queryBuilder.orderBy(
        `inforMovement.${key}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    const data = await queryBuilder
      .skip((pageIndex - 1) * pageSize)
      .take(pageSize)
      .getRawMany();

    const total = data.length; // ✅ Sửa lỗi đếm tổng số bản ghi

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }

  async findRelationById(id: number): Promise<InforMovement> {
    return await this.inforMovementRepository.findOne({
      where: { id },
      relations: [
        'deviceInOuts',
        'deviceInOuts.device',
        'removingTech',
        'returningTech',
      ],
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

  async createDeviceInOut(DeviceInOut: DeviceInOut): Promise<DeviceInOut> {
    return this.deviceInOutRepository.create(DeviceInOut);
  }

  async saveDeviceInOuts(entity: DeviceInOut[]): Promise<DeviceInOut[]> {
    return await this.deviceInOutRepository.save(entity);
  }
}
