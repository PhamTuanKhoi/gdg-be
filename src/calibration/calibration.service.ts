import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { CalibrationRepository } from './calibration.repository';
import { CalibrationTypeEnum } from './enums/calibration.type.enum';
import { Calibration } from './entities/calibration.entity';

@Injectable()
export class CalibrationService {
  constructor(private readonly calibrationRepository: CalibrationRepository) {}
  private readonly logger = new Logger(CalibrationService.name);
  findAll() {
    return `This action returns all calibration`;
  }

  async onModuleInit() {
    this.addCronJobAt5AM();
  }

  // '0 0 5 * * *', // Chạy vào 5:00 sáng mỗi ngày
  async addCronJobAt5AM() {
    const job = new CronJob(
      '*/5 * * * * *',
      () => {
        this.checkCalibraion();
      },
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );

    job.start();

    this.logger.debug(
      `✅ Đã thêm cron job  calibration vào lúc 5h sáng mỗi ngày!`,
    );
  }

  async checkCalibraion() {
    const devices =
      await this.calibrationRepository.findDevicesMaintenanceOrCalibration();

    if (devices && devices.length > 0) {
      await this.createCalibrations(devices);
      // send socket
    }

    this.logger.warn(`🕔 Đã đến 5h sáng! Chạy job: calibration`);
  }

  async createCalibrations(
    devices: {
      id: number;
      type: CalibrationTypeEnum;
      maintenanceDate: Date;
      next: Date;
    }[],
  ) {
    try {
      const calibrations = devices.map(({ id, type, maintenanceDate, next }) =>
        this.calibrationRepository.create({
          device: { id },
          type,
          maintenance: maintenanceDate,
          calibration: next,
        }),
      );

      await this.calibrationRepository.saveMany(calibrations as Calibration[]);
      this.logger.log(`saved ${devices.length} devices`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
