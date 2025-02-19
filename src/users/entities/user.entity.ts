import { AbstractEntity } from "../../../src/database/abstract.entity";
import { Column, Entity } from "typeorm";
import { UserRoleEnum } from "../enums/user.role.enum";

@Entity('user')
export class User extends AbstractEntity<User> {
    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    avartar: string;

    @Column()
    email: string;
  
    @Column()
    password: string;

    @Column()
    role: string;
}
