import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CronJob } from 'cron';
import { CalibrationRepository } from './calibration.repository';
import { CalibrationTypeEnum } from './enums/calibration.type.enum';
import { Calibration } from './entities/calibration.entity';
import { QueryCalibrationDto } from './dto/query-calibration.dto';
import { CreateCalibrationUserDto } from './dto/create-calibration-user.dto';
import { CalibrationUser } from './entities/calibration-user.entity';

@Injectable()
export class CalibrationService {
  constructor(private readonly calibrationRepository: CalibrationRepository) {}

  private readonly logger = new Logger(CalibrationService.name);

  async findAll(queryCalibrationDto: QueryCalibrationDto) {
    return await this.calibrationRepository.getLatestCalibrations(queryCalibrationDto);
  }

  async createCalibrationUser(dto: CreateCalibrationUserDto): Promise<CalibrationUser> {
    const { userId, calibrationId } = dto;

    try {
      const [user, calibration] = await Promise.all([
        this.calibrationRepository.findUserById(userId),
        this.calibrationRepository.findById(calibrationId),
      ]);

      if (!user || user == null) throw new NotFoundException('user_does_not_exits');
      if (!calibration || calibration == null) throw new NotFoundException('calibration_does_not_exits');

      // Lưu vào database
      const created = await this.calibrationRepository.createAndSaveCalibrationUser({ user, calibration });

      this.logger.log(`created a calibration by id #${created?.id}`);

      return created;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
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

    this.logger.debug(`✅ Đã thêm cron job  calibration vào lúc 5h sáng mỗi ngày!`);
  }

  async checkCalibraion() {
    try {
      this.logger.warn(`🕔 Đã đến 5h sáng! Chạy job: calibration`);

      const devices = await this.calibrationRepository.findDevicesMaintenanceOrCalibration();

      if (devices && devices.length > 0) {
        await this.createCalibrations(devices);
        // send socket
      }
    } catch (error) {
      this.logger.error(error);
    }
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
      const calibrations = [];
      for (const { id, type, maintenanceDate, next } of devices) {
        // --------------------- check calibration type next exists ------------------------
        if (type === CalibrationTypeEnum.CALIBRATION) {
          if (!next || next == null || next.toString() === '') continue;

          const calibrationExisting = await this.calibrationRepository.findCalibrationByDeviceNext(type, next, id);

          this.logger.debug(`calibrationExisting type next id #${calibrationExisting?.id}`);
          if (calibrationExisting && calibrationExisting != null) continue;
        }

        // --------------------- check calibration type maintenance exists ------------------------
        if (type === CalibrationTypeEnum.MAINTENANCE) {
          if (!maintenanceDate || maintenanceDate == null || maintenanceDate.toString() === '') continue;

          const calibrationExisting = await this.calibrationRepository.findCalibrationByDeviceMaintenance(
            type,
            maintenanceDate,
            id,
          );

          this.logger.debug(`calibrationExisting type maintenanceDate id #${calibrationExisting?.id}`);
          if (calibrationExisting && calibrationExisting != null) continue;
        }

        const calibration = this.calibrationRepository.create({
          device: { id },
          type,
          maintenance: maintenanceDate,
          calibration: next,
        });

        this.logger.log(`push calibration with device id#${id} type#${type}`);
        calibrations.push(calibration);
      }

      if (calibrations.length > 0) {
        await this.calibrationRepository.saveMany(calibrations as Calibration[]);
        this.logger.log(`saved ${calibrations.length} devices`);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
