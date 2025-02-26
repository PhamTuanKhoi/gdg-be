import { AbstractEntity } from 'src/database/abstract.entity';
import { Entity, Column, DeleteDateColumn } from 'typeorm'; 
import { UserRoleEnum } from '../enums/user.role.enum';

@Entity('user')
export class User extends AbstractEntity<User> {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatar: string; // Có thể null

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'int', default: UserRoleEnum.USER })
    role: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    position: string; // Có thể null

    // ----------------- short delete ------------------
    @DeleteDateColumn()
    deletedAt?: Date;
}
