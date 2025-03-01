import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/abstract.repository';
import { InforMovement } from './entities/infor-movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeviceInOut } from './entities/device-in-out.entity';
import { Device } from 'src/devices/entities/device.entity';

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

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findDeviceByIds(ids: number[]) {
    return await this.deviceRepository.find({
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
