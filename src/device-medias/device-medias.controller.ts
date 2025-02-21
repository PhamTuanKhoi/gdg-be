import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeviceMediasService } from './device-medias.service';
import { CreateDeviceMediaDto } from './dto/create-device-media.dto';
import { UpdateDeviceMediaDto } from './dto/update-device-media.dto';

@Controller('device-medias')
export class DeviceMediasController {
  constructor(private readonly deviceMediasService: DeviceMediasService) {}

  @Post()
  create(@Body() createDeviceMediaDto: CreateDeviceMediaDto) {
    return this.deviceMediasService.create(createDeviceMediaDto);
  }

  @Get()
  findAll() {
    return this.deviceMediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceMediasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceMediaDto: UpdateDeviceMediaDto) {
    return this.deviceMediasService.update(+id, updateDeviceMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceMediasService.remove(+id);
  }
}
