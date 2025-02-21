import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImportResultDto } from './dto/import-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import device từ file Excel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File Excel chứa thông tin Device',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Import thành công', type: ImportResultDto })
  @ApiResponse({ status: 400, description: 'File không hợp lệ' })
  @UseInterceptors(FileInterceptor('file'))
  async importDevices(@UploadedFile() file: Express.Multer.File): Promise<ImportResultDto> {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return this.devicesService.importDevices(file.buffer);
  } 

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }
}
