import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DeviceInOut } from './device-in-out.entity';
import { User } from 'src/users/entities/user.entity';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity('infor_movement')
export class InforMovement extends AbstractEntity<InforMovement> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  ownerName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  technician: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'timestamp' })
  toDate: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 255 })
  toLocation: string;

  @Column({ type: 'text', nullable: true })
  signature: string;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ type: 'varchar', length: 255 })
  qcVerifyingRemoving: string;

  @Column({ type: 'varchar', length: 255 })
  qcVerifyingReturning: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // ----------------- relation --------------------
  @OneToMany(() => DeviceInOut, (deviceInOut) => deviceInOut.inforMovement, {
    cascade: true,
  })
  deviceInOuts: DeviceInOut[];

  @ManyToOne(() => User, (user) => user.inforRemovings, {
    nullable: false,
  })
  removingTech: User;

  @ManyToOne(() => User, (user) => user.inforReturnings, {
    nullable: true,
  })
  returningTech: User;
}
