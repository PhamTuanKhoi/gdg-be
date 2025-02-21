import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import * as XLSX from 'xlsx';
import { DeviceRepository } from './devices.repository';

@Injectable()
export class DevicesService {
  constructor( 
    private readonly deviceRepository: DeviceRepository,
) {}

  async importDevices(fileBuffer: Buffer): Promise<{ created: number; updated: number }> {
    // Đọc file Excel từ buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); 

    const result = { created: 0, updated: 0 };

    for (const row of data) {
      const { code, name, location, address, type, status, MANUFACTURER, DESCRIPTION, MODEL, SERIAL, Location} = row;
      console.log(DESCRIPTION);
      

      let device = await this.deviceRepository.findOneByField('code', row['Asset#']);

      if (device) {
        // Update nếu device đã tồn tại
        device.name = name;
        device.location = location;
        device.address = address;
        device.type = type;
        device.status = status;
        await this.deviceRepository.save(device);
        result.updated++;
      } else {
        // Tạo mới nếu chưa có
        await this.deviceRepository.createDevice({ code: row['Asset#'], name: DESCRIPTION, location: MODEL, address, type, status });
        result.created++;
      }
    }

    return result;
  }

  create(createDeviceDto: CreateDeviceDto) {
    return 'This action adds a new device';
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
