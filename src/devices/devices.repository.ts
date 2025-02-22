import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceMedia } from 'src/device-medias/entities/device-media.entity';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceMedia)
    private readonly mediaRepository: Repository<DeviceMedia>,
  ) {}

  async findOneByField(field: keyof Device, value: any): Promise<Device | null> {
    return await this.deviceRepository.findOne({ where: { [field]: value } });
  }

  async findById(id: number): Promise<Device | null> {
    return await this.findOneByField('id', id);
  }

  async save(device: Partial<Device>): Promise<Device> {
    return await this.deviceRepository.save(device) as Device;
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    return await this.deviceRepository.create(createDeviceDto);
  }

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

