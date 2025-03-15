import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import * as XLSX from 'xlsx';
import { DevicesRepository } from './devices.repository';
import { Device } from './entities/device.entity';
import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { DeviceQueryDto } from './dto/query-devices.dto';
import { DeviceHistoryQueryDto } from './dto/query-history.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async createDevice(
    createDeviceDto: CreateDeviceDto,
    files: {
      files?: Express.Multer.File[];
      certificate?: Express.Multer.File[];
    },
  ): Promise<Device> {
    createDeviceDto = Object.fromEntries(
      Object.entries(createDeviceDto).filter(([_, value]) => value !== null && value !== undefined && value !== ''),
    ) as CreateDeviceDto;

    const existingCode = await this.devicesRepository.findOneByField('code', createDeviceDto.code);
    if (existingCode && existingCode !== null) throw new ConflictException('Code đã tồn tại.');

    if (files.certificate && files.certificate.length > 0) {
      createDeviceDto.certificate = `/upload/device/${files.certificate[0].filename}`; // chỉ 1 file certificate
    }

    // Create Device object from DTO
    const device = await this.devicesRepository.create(createDeviceDto);

    const savedDevice = await this.devicesRepository.save(device);

    // Save the uploaded files to DeviceMedia
    if (files?.files?.length > 0) {
      for (const file of files.files) {
        await this.devicesRepository.saveMedia({
          media: `/upload/device/${file.filename}`,
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
    const dateTime = new Date(excelEpoch.getTime() + (serial - daysOffset) * millisecondsInDay + millisecondsInDay);

    // Định dạng theo yyyy-mm-dd dựa trên UTC
    const year = dateTime.getUTCFullYear();
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0'); // Tháng từ 0 nên cần cộng 1
    const day = String(dateTime.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  async importDevices(fileBuffer: Buffer): Promise<{ created: number; updated: number; errors: object[] }> {
    // Đọc file Excel từ buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    // delete row undefind
    const data: any[] = XLSX.utils
      .sheet_to_json(workbook.Sheets[sheetName])
      .filter((row) => Object.values(row).some((value) => value !== undefined && value !== null && value !== ''));

    const result = { created: 0, updated: 0 };

    let fieldErrors: object[] = [];
    let validRows: number = 0;
    for (const row of data) {
      const hasError = await this.validExcelFile(row, fieldErrors);

      if (hasError) {
        console.log(`Bỏ qua STT ${row.STT} do có lỗi`);
        continue;
      }

      validRows++;
      console.log(`Xử lý STT ${row.STT}`);

      const calibrationDate =
        typeof row.NCAL_DATE === 'number' ? await this.excelSerialToDate(row.NCAL_DATE) : row.NCAL_DATE;
      const calibrationEndDate =
        typeof row.DUE_DATE === 'number' ? await this.excelSerialToDate(row.DUE_DATE) : row.DUE_DATE;

      // find, findBy, findOne, findOneBy skips the query when the value is undefined or null
      const device = await this.devicesRepository.findOneByField('code', row.ASSET_NO);

      if (device) {
        // Update nếu device đã tồn tại
        device.code = row.ASSET_NO;
        device.manufacturer = row.MANUFACTURER;
        device.model = row.MODEL;
        device.serial = row.SERIAL_NO;
        device.name_vi = row.DESCRIPTION_VI;
        device.name_en = row.DESCRIPTION_EN;
        device.last = calibrationDate || null;
        device.next = calibrationEndDate || null;
        device.location = row.LOCATION;
        await this.devicesRepository.save(device);
        result.updated++;
      } else {
        const payload = {
          code: row.ASSET_NO,
          manufacturer: row.MANUFACTURER,
          model: row.MODEL,
          serial: row.SERIAL_NO,
          name_vi: row.DESCRIPTION_VI,
          name_en: row.DESCRIPTION_EN,
          last: calibrationDate || null,
          next: calibrationEndDate || null,
          location: row.LOCATION,
        };

        await this.devicesRepository.save({ ...payload });
        result.created++;
      }
    }

    if (validRows === 0) {
      throw new ConflictException('File không hợp lệ. Tất cả dòng đều có lỗi.');
    }

    return { ...result, errors: fieldErrors };
  }

  async validExcelFile(row, fieldErrors: object[]): Promise<boolean> {
    const requiredFields = [
      { key: 'ASSET_NO', message: 'missing CODE' },
      { key: 'MANUFACTURER', message: 'missing MANUFACTURER' },
      { key: 'MODEL', message: 'missing MODEL' },
      { key: 'SERIAL_NO', message: 'missing SERIAL_NO' },
      { key: 'DESCRIPTION_VI', message: 'missing DESCRIPTION_VI' },
    ];

    for (const { key, message } of requiredFields) {
      if (!row[key] || row[key] === null || row[key] === '') {
        fieldErrors.push({ STT: row.STT, error: message });
        return true;
      }
    }

    if (typeof row.NCAL_DATE !== 'number') {
      fieldErrors.push({ STT: row.STT, error: 'missing NCAL_DATE' });
      return true;
    }

    if (typeof row.DUE_DATE !== 'number') {
      fieldErrors.push({ STT: row.STT, error: 'missing DUE_DATE' });
      return true;
    }

    return false;
  }

  async findAll(queryDto: DeviceQueryDto) {
    return await this.devicesRepository.findAll(queryDto);
  }

  async findAllCalibration(queryDto: DeviceQueryDto) {
    return await this.devicesRepository.findAllCalibration(queryDto);
  }

  async findByCode(code: string): Promise<Device> {
    return await this.devicesRepository.findOneByField('code', code);
  }

  async findByHistory(id: number, queryDto: DeviceHistoryQueryDto) {
    return await this.devicesRepository.findByHistory(id, queryDto);
  }

  async findOne(id: number) {
    return await this.devicesRepository.findByIdRelation(id);
  }

  async update(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
    files: {
      files?: Express.Multer.File[];
      certificate?: Express.Multer.File[];
    },
  ) {
    const device = await this.devicesRepository.findById(id);
    if (!device) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }

    const [existingCode] = await Promise.all([
      updateDeviceDto.code ? this.devicesRepository.findOneByField('code', updateDeviceDto.code) : null,
    ]);

    if (existingCode && existingCode.id !== +id) throw new ConflictException('Code đã tồn tại.');

    if (files?.files?.length > 0) {
      for (const file of files.files) {
        await this.devicesRepository.saveMedia({
          media: `/upload/device/${device.id}/${file.filename}`,
          device: device,
        });
      }
    }

    if (files.certificate && files.certificate.length > 0) {
      device.certificate = `/upload/device/${device.id}/${files.certificate[0].filename}`;
    }

    // Update device information from DTO
    delete updateDeviceDto?.files;
    Object.assign(device, updateDeviceDto);

    if (!updateDeviceDto.maintenanceDate) {
      device.maintenanceDate = null;
    }

    return await this.devicesRepository.update(id, device);
  }

  async removeMedia(id: number): Promise<DeviceMedia> {
    const deviceMedia = await this.devicesRepository.findMediaById(id);
    if (!deviceMedia) {
      throw new NotFoundException(`DeviceMedia with id ${id} not found`);
    }
    return await this.devicesRepository.rmoveMedia(deviceMedia);
  }

  async remove(id: number) {
    return await this.devicesRepository.delete(id);
  }
}
