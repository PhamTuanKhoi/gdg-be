import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BaseRepository } from 'src/database/abstract.repository';

@Injectable()
export class DevicesRepository extends BaseRepository<Device> {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceMedia)
    private readonly mediaRepository: Repository<DeviceMedia>,
  ) {
    super(deviceRepository);
  }

  async findAll({
    query,
    order,
    key,
    pageIndex = 1,
    pageSize = 10,
  }: DeviceQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: Device[];
  }> {
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
      order: key ? { [key]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      relations: ['medias'],
    });

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
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
