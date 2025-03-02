import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { InforMovementsRepository } from './infor-movements.repository';
import { DeviceInOut } from './entities/device-in-out.entity';
import { InforMovementQueryDto } from './dto/query-infor-movements.dto';
import { User } from 'src/users/entities/user.entity';
import { InforMovement } from './entities/infor-movement.entity';

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

    const inforMovement = await this.inforMovementsRepository.save({
      ...createInforMovementDto,
      removingTech: user,
    });

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
      device_ids,
      ...validFields
    }: UpdateInforMovementDto,
  ) {
    // ------------------------ validate -----------------------

    const inforMovement = await this.findOne(id);
    Object.assign(inforMovement, validFields);

    if (!inforMovement || inforMovement == null) {
      throw new NotFoundException('InforMovement không tồn tại.');
    }

    // ----------------------------- in -------------------------------
    if (deviceInOut_ids && deviceInOut_ids.length > 0) {
      await this.updateDeviceOut(deviceInOut_ids);

      const user = await this.existUser(returningTech_id);
      return await this.inforMovementsRepository.update(id, {
        ...inforMovement,
        returningTech: user,
      });
    }
    // ----------------------------- out -------------------------------
    else {
      if (device_ids && device_ids.length > 0) {
        await this.saveDeviceIn(device_ids, validFields.date, inforMovement);
      }
    }

    return await this.inforMovementsRepository.update(id, inforMovement);
  }

  async saveDeviceIn(
    device_ids: number[],
    date: Date,
    inforMovement: InforMovement,
  ): Promise<void> {
    try {
      const devices =
        await this.inforMovementsRepository.findDeviceByIds(device_ids);

      if (devices.length !== device_ids.length) {
        throw new NotFoundException('One or more devices not found');
      }

      // 🔥 Lấy danh sách DeviceInOut đã tồn tại
      const existingRecords =
        await this.inforMovementsRepository.findDeviceInOutByMovementAndDevices(
          inforMovement.id,
          device_ids,
        );

      const existingDeviceIds = new Set(
        existingRecords.map((record) => record.device.id),
      );

      // 🔥 Chỉ tạo mới nếu chưa có
      const deviceInOuts = devices
        .filter((device) => !existingDeviceIds.has(device.id))
        .map((device) =>
          this.inforMovementsRepository.createDeviceInOut({
            dateIn: null,
            dateOut: date,
            inforMovement,
            device,
          }),
        );

      if (deviceInOuts.length > 0) {
        await this.inforMovementsRepository.saveDeviceInOuts(deviceInOuts);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateDeviceOut(deviceInOut_ids): Promise<void> {
    try {
      if (deviceInOut_ids && deviceInOut_ids.length > 0) {
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

        await this.inforMovementsRepository.saveDeviceInOuts(
          createDeviceInOuts,
        );
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
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
