import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceMedia } from 'src/device-medias/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm'; 

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceMedia)
    private readonly mediaRepository: Repository<DeviceMedia>,
  ) {}

  async findAll({
    query,
    order,
    key,
    pageIndex = 1,
    pageSize = 10,
  }: DeviceQueryDto): Promise<{ total: number; pageIndex: number; pageSize: number; data: Device[] }> {
    const where: FindOptionsWhere<Device>[] = [];

    // ✅ Apply full-text search on all columns
    if (query) {
      where.push(
        { code: ILike(`%${query}%`) },
        { name_vi: ILike(`%${query}%`) },
        { name_en: ILike(`%${query}%`) },
        { manufacturer: ILike(`%${query}%`) },
        { serial: ILike(`%${query}%`) },
        { model: ILike(`%${query}%`) },
      );
    }
    
    // ✅ Use findAndCount to reduce query times
    const [data, total] = await this.deviceRepository.findAndCount({
      where: where.length ? where : undefined,
      order:  key ? { [key]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return { total, pageIndex, pageSize, data };
  } 

  async findOneByField(field: keyof Device, value: any): Promise<Device | null> {
    if (!value || value == null) {return}
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

