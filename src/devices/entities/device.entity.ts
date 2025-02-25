import { DeviceMedia } from 'src/devices/entities/device-media.entity';
import { AbstractEntity } from '../../../src/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm'; 

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

    @Column({ type: 'varchar', length: 500, nullable: true })
    location: string; 

    @Column({ type: 'date', nullable: true })
    calibrationDate: Date;   

    @Column({ type: 'date', nullable: true })
    calibrationEndDate: Date;    

    @Column({ type: 'varchar', length: 255, nullable: true })
    certificate: string;  

    // ----------------- order ----------------------
    @Column({ type: 'varchar', length: 100, nullable: true })
    type: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    period: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string; 

    // ----------------- relation --------------------
    @OneToMany(() => DeviceMedia, (deviceMedia) => deviceMedia.device, {
        cascade: true,  
    })
    medias: DeviceMedia[];
}
