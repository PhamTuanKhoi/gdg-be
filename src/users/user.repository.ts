import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return await this.userRepository.findOneBy({
        username
    })
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({
        id
    })
  }

  async save(userDto: any) {
    return await this.userRepository.save(userDto);
  }

}