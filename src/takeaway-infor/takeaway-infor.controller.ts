import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TakeawayInforService } from './takeaway-infor.service';
import { CreateTakeawayInforDto } from './dto/create-takeaway-infor.dto';
import { UpdateTakeawayInforDto } from './dto/update-takeaway-infor.dto';

@Controller('takeaway-infor')
export class TakeawayInforController {
  constructor(private readonly takeawayInforService: TakeawayInforService) {}

  @Post()
  create(@Body() createTakeawayInforDto: CreateTakeawayInforDto) {
    return this.takeawayInforService.create(createTakeawayInforDto);
  }

  @Get()
  findAll() {
    return this.takeawayInforService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.takeawayInforService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTakeawayInforDto: UpdateTakeawayInforDto) {
    return this.takeawayInforService.update(+id, updateTakeawayInforDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.takeawayInforService.remove(+id);
  }
}
