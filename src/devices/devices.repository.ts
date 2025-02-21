import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {} 

  async findOneByField(field: keyof Device, value: any): Promise<Device | null> {
    return await this.deviceRepository.findOne({ where: { [field]: value } });
  }

  async findById(id: number): Promise<Device | null> {
    return this.findOneByField('id', id);
  }

  async save(device: Partial<Device>): Promise<Device> {
    return await this.deviceRepository.save(device) as Device;  
  }

  async createDevice(deviceDto: Partial<Device>): Promise<Device> {
    const device = this.deviceRepository.create(deviceDto);
    return await this.deviceRepository.save(device);
  }
}
