import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { InforMovementsRepository } from './infor-movements.repository';
import { DeviceInOut } from './entities/device-in-out.entity';
import { InforMovementQueryDto } from './dto/query-infor-movements.dto';

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
          dateIn: createInforMovementDto.date,
          dateOut: createInforMovementDto.toDate,
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

  update(id: number, updateInforMovementDto: UpdateInforMovementDto) {
    return `This action updates a #${id} inforMovement`;
  }

  remove(id: number) {
    return `This action removes a #${id} inforMovement`;
  }
}
