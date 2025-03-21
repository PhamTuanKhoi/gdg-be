import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryCalibrationDto } from './dto/query-calibration.dto';
import { CreateCalibrationUserDto } from './dto/create-calibration-user.dto';

@ApiTags('calibrations')
@Controller('notification')
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách calibration mới nhất',
    description: 'Trả về danh sách các calibration mới nhất với giới hạn số lượng và trạng thái đã xem dựa trên userId',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Dữ liệu đầu vào không hợp lệ',
  })
  async findAll(@Query() queryCalibrationDto: QueryCalibrationDto) {
    return this.calibrationService.findAll(queryCalibrationDto);
  }

  @Post('wiewer')
  @ApiOperation({
    summary: 'Tạo mới một CalibrationUser',
    description: 'Liên kết một User với một Calibration',
  })
  @ApiBody({ type: CreateCalibrationUserDto })
  async createCalibrationUser(@Body() dto: CreateCalibrationUserDto) {
    return this.calibrationService.createCalibrationUser(dto);
  }

  @Post('viewer/all')
  @ApiOperation({
    summary: 'Tạo mới tất cả CalibrationUser với userId',
    description: 'Liên kết một User với tất cả Calibration',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'ID của user cần liên kết với tất cả calibration',
          example: 1,
        },
      },
      required: ['userId'],
    },
  })
  async createAllCalibrationByUser(@Body() dto: { userId: number }) {
    return this.calibrationService.createAllCalibrationByUser(dto.userId);
  }
}
