import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import * as XLSX from 'xlsx';
import { DevicesRepository } from './devices.repository';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/device-medias/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';


@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository
  ) { }

  async createDevice(createDeviceDto: CreateDeviceDto, files: Express.Multer.File[]): Promise<Device> {
    const existingCode =  await this.devicesRepository.findOneByField('code', createDeviceDto.code) 
    if (existingCode && existingCode !== null) throw new ConflictException('Code đã tồn tại.'); 

    // Create Device object from DTO
    const device = await this.devicesRepository.create(createDeviceDto);
 
    const savedDevice = await this.devicesRepository.save(device);

    // Save the uploaded files to DeviceMedia
    if (files.length > 0) {
      for (const file of files) {
        await this.devicesRepository.saveMedia({
          media: `/uploads/devices/${file.filename}`,
          device: savedDevice,
        });
      }
    }
    return savedDevice;
  }

  async excelSerialToDate(serial: number): Promise<string> {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Ngày gốc của Excel tính theo UTC
    const daysOffset = serial > 59 ? 1 : 0; // Bù lỗi năm 1900 của Excel
    const millisecondsInDay = 86400000;
    // Tính toán ngày, sau đó cộng thêm 1 ngày
    const dateTime = new Date(excelEpoch.getTime() + ((serial - daysOffset) * millisecondsInDay) + millisecondsInDay);
  
    // Định dạng theo yyyy-mm-dd dựa trên UTC
    const year = dateTime.getUTCFullYear();
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0'); // Tháng từ 0 nên cần cộng 1
    const day = String(dateTime.getUTCDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  async importDevices(fileBuffer: Buffer): Promise<{ created: number; updated: number; }> {
    // Đọc file Excel từ buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    // delete row undefind
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    .filter(row => Object.values(row).some(value => value !== undefined && value !== null && value !== ''));

    const result = { created: 0, updated: 0 };

    for (const row of data) {
      const { ASSET_NO, MANUFACTURER, DESCRIPTION_VI, DESCRIPTION_EN, MODEL, SERIAL_NO, NCAL_DATE, DUE_DATE, LOCATION } = row;
      
      const calibrationDate = typeof NCAL_DATE === 'number' ? await this.excelSerialToDate(NCAL_DATE) : NCAL_DATE;
      const calibrationEndDate = typeof DUE_DATE === 'number' ? await this.excelSerialToDate(DUE_DATE) : DUE_DATE;

      // find, findBy, findOne, findOneBy skips the query when the value is undefined or null
      if (!ASSET_NO || ASSET_NO == null) {
        return
      }

      let device = await this.devicesRepository.findOneByField('code', ASSET_NO);

      if (device) {
        // Update nếu device đã tồn tại
        device.code = ASSET_NO;
        device.manufacturer = MANUFACTURER;
        device.model = MODEL;
        device.serial = SERIAL_NO;
        device.name_vi = DESCRIPTION_VI;
        device.name_en = DESCRIPTION_EN;
        device.calibrationDate = calibrationDate || null;
        device.calibrationEndDate = calibrationEndDate || null;
        device.location = LOCATION; 
        await this.devicesRepository.save(device);
        result.updated++;
      } else {
        const payload = {
          code: ASSET_NO,
          manufacturer: MANUFACTURER,
          model: MODEL,
          serial: SERIAL_NO,
          name_vi: DESCRIPTION_VI,
          name_en: DESCRIPTION_EN,
          calibrationDate: calibrationDate || null,
          calibrationEndDate: calibrationEndDate || null,
          location: LOCATION
        } 
        
        await this.devicesRepository.save({...payload});
        result.created++;
      }
    }

    return result;
  } 

  async findAll(queryDto: DeviceQueryDto) {
    return await this.devicesRepository.findAll(queryDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto, files: Express.Multer.File[]) {
    const device = await this.devicesRepository.findById(id);
    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    const [existingCode] = await Promise.all([
      updateDeviceDto.code ? this.devicesRepository.findOneByField('code', updateDeviceDto.code) : null,
    ]);

    if (existingCode && existingCode.id !== +id) throw new ConflictException('Code đã tồn tại.'); 

    // Update device information from DTO
    Object.assign(device, updateDeviceDto);
     
    if (files?.length > 0) {
      for (const file of files) {
        await this.devicesRepository.saveMedia({
          media: `/uploads/devices/${file.filename}`,
          device: device,
        });
      }
    }
 
    return await this.devicesRepository.save(device);
  } 

  async removeMedia(id: number): Promise<DeviceMedia> {
    const deviceMedia = await this.devicesRepository.findMediaById(id)
    if (!deviceMedia) {
      throw new NotFoundException(`DeviceMedia with id ${id} not found`);
    }
    return await this.devicesRepository.rmoveMedia(deviceMedia);
  }
  

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
