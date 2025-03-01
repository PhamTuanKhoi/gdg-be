import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InforMovementsService } from './infor-movements.service';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Infor Movement')
@Controller('infor-movements')
export class InforMovementsController {
  constructor(private readonly inforMovementsService: InforMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thông tin di chuyển' })
  async create(@Body() createInforMovementDto: CreateInforMovementDto) {
    return await this.inforMovementsService.create(createInforMovementDto);
  }

  @Get()
  findAll() {
    return this.inforMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inforMovementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInforMovementDto: UpdateInforMovementDto,
  ) {
    return this.inforMovementsService.update(+id, updateInforMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inforMovementsService.remove(+id);
  }
}
