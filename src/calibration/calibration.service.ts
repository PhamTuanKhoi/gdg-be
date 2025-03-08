import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { CalibrationRepository } from './calibration.repository';

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
      '*/5 * * * * *', // Chạy vào 5:00 sáng mỗi ngày
      () => {
        this.checkCalibraion();
      },
      null,
      true,
      'Asia/Ho_Chi_Minh', // Đảm bảo chạy theo múi giờ Việt Nam
    );

    job.start();

    this.logger.debug(
      `✅ Đã thêm cron job  calibration vào lúc 5h sáng mỗi ngày!`,
    );
  }

  async checkCalibraion() {
    const data =
      await this.calibrationRepository.findDevicesMaintenanceOrCalibration();
    console.log(data);

    this.logger.warn(`🕔 Đã đến 5h sáng! Chạy job: calibration`);
  }
}
