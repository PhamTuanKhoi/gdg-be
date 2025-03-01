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
    const where: FindOptionsWhere<InforMovement>[] = [];

    // ✅ Apply full-text search on all columns
    if (query) {
      where.push(
        { ownerName: ILike(`%${query}%`) },
        { address: ILike(`%${query}%`) },
        { technician: ILike(`%${query}%`) },
        { location: ILike(`%${query}%`) },
        { toLocation: ILike(`%${query}%`) },
        { signature: ILike(`%${query}%`) },
      );
    }

    // ✅ Use findAndCount to reduce query times
    const [data, total] = await this.inforMovementRepository.findAndCount({
      where: where.length ? where : undefined,
      order: key ? { [key]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }

  async findRelationById(id: number): Promise<InforMovement> {
    return await this.inforMovementRepository.findOne({
      where: { id },
      relations: ['deviceInOuts', 'deviceInOuts.device'],
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
