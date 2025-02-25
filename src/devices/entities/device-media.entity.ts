import { AbstractEntity } from "src/database/abstract.entity";
import { Device } from "src/devices/entities/device.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('device_media')
export class DeviceMedia extends AbstractEntity<DeviceMedia> {
    @Column({ type: 'varchar', length: 500, nullable: true })
    media: string;
    
    @ManyToOne(() => Device, (device) => device.medias, {
        nullable: false,
        onDelete: 'CASCADE',  
    })
    device: Device;
}
