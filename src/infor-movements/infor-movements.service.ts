import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { InforMovementsRepository } from './infor-movements.repository';
import { DeviceInOut } from './entities/device-in-out.entity';
import { InforMovementQueryDto } from './dto/query-infor-movements.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class InforMovementsService {
  constructor(
    private readonly inforMovementsRepository: InforMovementsRepository,
  ) {}

  async create(createInforMovementDto: CreateInforMovementDto) {
    const user = await this.inforMovementsRepository.findUserById(
      createInforMovementDto.removingTech_id,
    );

    if (!user || user == null || !createInforMovementDto.removingTech_id) {
      throw new NotFoundException('User không tồn tại.');
    }

    const devices = await this.inforMovementsRepository.findDeviceByIds(
      createInforMovementDto.device_ids,
    );

    if (devices.length !== createInforMovementDto.device_ids.length) {
      throw new NotFoundException('One or more devices not found');
    }

    const inforMovement = await this.inforMovementsRepository.save({
      ...createInforMovementDto,
      removingTech: user,
    });

    const deviceInOuts: DeviceInOut[] = await Promise.all(
      devices.map(async (device) => {
        return this.inforMovementsRepository.createDeviceInOut({
          dateIn: null,
          dateOut: createInforMovementDto.date,
          inforMovement: inforMovement,
          device: device,
        } as DeviceInOut);
      }),
    );

    // 4. Lưu DeviceInOut vào database
    await this.inforMovementsRepository.saveDeviceInOuts(deviceInOuts);

    return inforMovement;
  }

  async findAll(inforMovementQueryDto: InforMovementQueryDto) {
    return await this.inforMovementsRepository.findAll(inforMovementQueryDto);
  }

  async findRelationById(id: number) {
    return await this.inforMovementsRepository.findRelationById(id);
  }

  async findOne(id: number) {
    return await this.inforMovementsRepository.findById(id);
  }

  async update(
    id: number,
    {
      returningTech_id,
      deviceInOut_ids,
      ...validFields
    }: UpdateInforMovementDto,
  ) {
    // ------------------------ validate -----------------------
    const user = await this.existUser(returningTech_id);

    const inforMovement = await this.findOne(id);
    if (!inforMovement || inforMovement == null) {
      throw new NotFoundException('InforMovement không tồn tại.');
    }

    if (deviceInOut_ids.length > 0) {
      const deviceInOuts: DeviceInOut[] =
        await this.inforMovementsRepository.findDeviceInOutByIds(
          deviceInOut_ids,
        );

      if (deviceInOuts.length !== deviceInOut_ids.length) {
        throw new NotFoundException('One or more deviceInOuts not found');
      }

      const createDeviceInOuts: DeviceInOut[] = await Promise.all(
        deviceInOuts.map(async (deviceInOut) => {
          return this.inforMovementsRepository.createDeviceInOut({
            ...deviceInOut,
            dateIn: new Date(),
          } as DeviceInOut);
        }),
      );

      await this.inforMovementsRepository.saveDeviceInOuts(createDeviceInOuts);
    }

    Object.assign(inforMovement, validFields);

    return await this.inforMovementsRepository.update(id, {
      ...inforMovement,
      returningTech: user,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} inforMovement`;
  }

  async existUser(userId: number): Promise<User> {
    const user = await this.inforMovementsRepository.findUserById(userId);

    if (!user || user == null || !userId) {
      throw new NotFoundException('User không tồn tại.');
    }
    return user;
  }
}
