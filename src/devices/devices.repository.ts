import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BaseRepository } from 'src/database/abstract.repository';
import { DeviceInOut } from 'src/infor-movements/entities/device-in-out.entity';

@Injectable()
export class DevicesRepository extends BaseRepository<Device> {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceMedia)
    private readonly mediaRepository: Repository<DeviceMedia>,
    @InjectRepository(DeviceInOut)
    private readonly deviceInOutRepository: Repository<DeviceInOut>,
  ) {
    super(deviceRepository);
  }

  async findAll({ query, order, key, pageIndex = 1, pageSize = 10 }: DeviceQueryDto): Promise<{
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

  async findByHistory(id: number, { query, order = 'asc', key = 'id', pageIndex = 1, pageSize = 10 }: DeviceQueryDto) {
    const queryBuilder = this.deviceInOutRepository
      .createQueryBuilder('deviceInOut')
      // Select specific fields from DeviceInOut
      .select([
        'deviceInOut.id',
        'deviceInOut.createdAt',
        'deviceInOut.updatedAt',
        'deviceInOut.dateIn',
        'deviceInOut.dateOut',
      ])
      // Join infoMovement without selecting the whole thing, just select specific columns
      .leftJoin('deviceInOut.inforMovement', 'inforMovement')
      .addSelect(['inforMovement.id', 'inforMovement.ownerName', 'inforMovement.location', 'inforMovement.toLocation'])
      // Join device without selecting the whole thing, just select specific columns
      .leftJoin('deviceInOut.device', 'device')
      .addSelect(['device.id', 'device.code', 'device.name_en', 'device.name_vi'])
      // Join medias (get all)
      .leftJoinAndSelect('device.medias', 'medias')
      // Join removingTech without selecting all, just select name
      .leftJoin('inforMovement.removingTech', 'removingTech')
      .addSelect(['removingTech.id', 'removingTech.name'])
      // Join returningTech (if needed)
      .leftJoin('inforMovement.returningTech', 'returningTech')
      .addSelect(['returningTech.id', 'returningTech.name'])
      .where('device.id = :deviceId', { deviceId: id });

    if (query) {
      queryBuilder.andWhere(
        `(inforMovement.ownerName LIKE :query 
          OR inforMovement.location LIKE :query 
          OR inforMovement.toLocation LIKE :query 
          OR removingTech.name LIKE :query 
          OR returningTech.name LIKE :query)`,
        {
          query: `%${query}%`,
        },
      );
    }

    // Check for valid key
    const validKeys = ['id', 'createdAt', 'updatedAt', 'dateIn', 'dateOut'];
    const orderKey = validKeys.includes(key) ? key : 'id';

    queryBuilder.orderBy(`deviceInOut.${orderKey}`, order.toUpperCase() as 'ASC' | 'DESC');

    const skip = (pageIndex - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    try {
      // console.log('Generated SQL:', queryBuilder.getSql()); // Debug SQL
      const [results, total] = await queryBuilder.getManyAndCount();

      if (!results.length && pageIndex === 1) {
        throw new NotFoundException(`Không tìm thấy bản ghi DeviceInOut nào cho device ID ${id}`);
      }

      return {
        data: results,
        total,
        pageIndex,
        pageSize,
      };
    } catch (error) {
      console.error('Lỗi khi thực thi truy vấn:', error);
      throw error;
    }
  }

  async findByIdRelation(id: number): Promise<Device> {
    return await this.deviceRepository.findOne({
      where: { id },
      relations: ['medias'],
    });
  }

  // async findByHistory(id: number): Promise<Device> {
  //   const device = await this.deviceRepository.findOne({
  //     where: { id },
  //     relations: [
  //       'medias',
  //       'deviceInOuts',
  //       'deviceInOuts.inforMovement',
  //       'deviceInOuts.inforMovement.removingTech',
  //       'deviceInOuts.inforMovement.returningTech',
  //     ],
  //   });

  //   if (!device) return null;

  //   return device;
  // }

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
