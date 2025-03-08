import { AbstractEntity } from 'src/database/abstract.entity';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Calibration } from './calibration.entity';

@Entity('calibration_user')
export class CalibrationUser extends AbstractEntity<CalibrationUser> {
  // ----------------- relation --------------------
  @ManyToOne(() => User, (user) => user.calibrationUsers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Calibration, (calibration) => calibration.calibrationUsers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  calibration: Calibration;
}
