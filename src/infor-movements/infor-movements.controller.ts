import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InforMovementsService } from './infor-movements.service';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InforMovementQueryDto } from './dto/query-infor-movements.dto';

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
  @ApiOperation({
    summary: 'Lấy danh sách Infor Movement có phân trang, tìm kiếm và sắp xếp',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách InforMovement được trả về.',
  })
  async findAll(@Query() queryDto: InforMovementQueryDto) {
    return this.inforMovementsService.findAll(queryDto);
  }

  @Get('relation/:id')
  @ApiOperation({ summary: 'Get infor-movements by id' })
  async findRelationById(@Param('id') id: string) {
    return this.inforMovementsService.findRelationById(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inforMovementsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'cập nhật thông tin di chuyển' })
  async update(
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
