import { Controller, Get } from '@nestjs/common';
import { CalibrationService } from './calibration.service';

@Controller('calibration')
export class CalibrationController {
  constructor(private readonly calibrationService: CalibrationService) {}

  @Get()
  findAll() {
    return this.calibrationService.findAll();
  }
}
