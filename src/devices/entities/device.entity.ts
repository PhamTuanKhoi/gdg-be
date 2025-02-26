import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { AbstractEntity } from '../../../src/database/abstract.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class Device extends AbstractEntity<Device> {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name_vi: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name_en: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serial: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  place: string;

  @Column({ type: 'int', nullable: true })
  location: number;

  @Column({ type: 'date', nullable: true })
  last: Date;

  @Column({ type: 'date', nullable: true })
  next: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  certificate: string;

  @Column({ type: 'int', nullable: true })
  notifcation_time: number;

  // ----------------- order ----------------------
  @Column({ type: 'int', nullable: true })
  type: number;

  @Column({ type: 'int', nullable: true })
  period: number;

  @Column({ type: 'int', nullable: true })
  status: number;

  // ----------------- relation --------------------
  @OneToMany(() => DeviceMedia, (deviceMedia) => deviceMedia.device, {
    cascade: true,
  })
  medias: DeviceMedia[];

  // ----------------- short delete ------------------
  @DeleteDateColumn()
  deletedAt?: Date;
}
