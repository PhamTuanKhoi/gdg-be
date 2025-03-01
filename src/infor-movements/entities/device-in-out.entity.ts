import { Column, Entity, ManyToOne } from 'typeorm';
import { InforMovement } from './infor-movement.entity';
import { Device } from 'src/devices/entities/device.entity';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity('device_in_out')
export class DeviceInOut extends AbstractEntity<DeviceInOut> {
  @Column({ type: 'timestamp', nullable: true })
  dateIn: Date;

  @Column({ type: 'timestamp' })
  dateOut: Date;

  // ----------------- relation --------------------
  @ManyToOne(
    () => InforMovement,
    (inforMovement) => inforMovement.deviceInOuts,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  inforMovement: InforMovement;

  @ManyToOne(() => Device, (device) => device.deviceInOuts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  device: Device;
}
