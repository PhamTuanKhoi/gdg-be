import { AbstractEntity } from "../../../src/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity('user')
export class User extends AbstractEntity<User> {
    @Column()
    name: string;

    @Column()
    avartar: string;

    @Column()
    email: string;
  
    @Column()
    password: string;
}
