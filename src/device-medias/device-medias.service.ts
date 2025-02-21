import { Injectable } from '@nestjs/common';
import { CreateDeviceMediaDto } from './dto/create-device-media.dto';
import { UpdateDeviceMediaDto } from './dto/update-device-media.dto';

@Injectable()
export class DeviceMediasService {
  create(createDeviceMediaDto: CreateDeviceMediaDto) {
    return 'This action adds a new deviceMedia';
  }

  findAll() {
    return `This action returns all deviceMedias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceMedia`;
  }

  update(id: number, updateDeviceMediaDto: UpdateDeviceMediaDto) {
    return `This action updates a #${id} deviceMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceMedia`;
  }
}
