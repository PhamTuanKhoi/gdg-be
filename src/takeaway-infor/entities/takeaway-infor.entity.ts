import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TakeawayInfor {
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
  removingTech: string;

  @Column({ type: 'varchar', length: 255 })
  qcVerifyingRemoving: string;

  @Column({ type: 'varchar', length: 255 })
  returningTech: string;

  @Column({ type: 'varchar', length: 255 })
  qcVerifyingReturning: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
