import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpException, UploadedFiles, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImportResultDto } from './dto/import-device.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DeviceQueryDto } from './dto/query-devices.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device with multiple file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Device data with files',
    type: CreateDeviceDto,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/', // Đường dẫn lưu file
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.devicesService.createDevice(createDeviceDto, files);
  }

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


  @Get()
  @ApiOperation({ summary: 'Lấy danh sách device có phân trang, tìm kiếm và sắp xếp' })
  @ApiResponse({ status: 200, description: 'Danh sách device được trả về.' })
  async getAllUsers(@Query() queryDto: DeviceQueryDto) {
    return this.devicesService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing device with optional file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Device update data with files',
    type: UpdateDeviceDto, // Bạn có thể tạo DTO riêng cho update nếu cần
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/', // Đường dẫn lưu file
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateDevice(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.devicesService.update(id, updateDeviceDto, files);
  }
  
  @Delete('media/:id')
  async removeMedia(@Param('id') id: string) {
    return this.devicesService.removeMedia(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }
}
