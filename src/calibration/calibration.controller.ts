import { Controller, Get, Query } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryCalibrationDto } from './dto/query-calibration.dto';

@ApiTags('calibrations')
@Controller('calibration')
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách calibration mới nhất',
    description:
      'Trả về danh sách các calibration mới nhất với giới hạn số lượng và trạng thái đã xem dựa trên userId',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Dữ liệu đầu vào không hợp lệ',
  })
  async findAll(@Query() queryCalibrationDto: QueryCalibrationDto) {
    return this.calibrationService.findAll(queryCalibrationDto);
  }
}
