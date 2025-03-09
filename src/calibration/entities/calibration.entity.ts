import { AbstractEntity } from 'src/database/abstract.entity';
import { Device } from 'src/devices/entities/device.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CalibrationUser } from './calibration-user.entity';

@Entity()
export class Calibration extends AbstractEntity<Calibration> {
  // ----------------- relation --------------------
  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ type: 'date', nullable: true })
  maintenance: Date;

  @Column({ type: 'date', nullable: true })
  calibration: Date;

  @ManyToOne(() => Device, (device) => device.calibrations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  device: Device;

  @OneToMany(
    () => CalibrationUser,
    (calibrationUsers) => calibrationUsers.calibration,
    {
      cascade: true,
    },
  )
  calibrationUsers: CalibrationUser[];
}
