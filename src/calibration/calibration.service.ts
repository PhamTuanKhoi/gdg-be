import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CalibrationService {
  private readonly logger = new Logger(CalibrationService.name);
  findAll() {
    return `This action returns all calibration`;
  }
}
