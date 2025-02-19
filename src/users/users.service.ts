import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcrypt";
import { UserRoleEnum } from './enums/user.role.enum';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByUsername(username: string) {
    return await this.userRepository.findByUsername(username)
  }

  async findById(id: number) {
    return await this.userRepository.findById(id)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async onApplicationBootstrap() {
    const existingUser = await this.userRepository.findByUsername('admin');
    if (!existingUser) {
      const passwordHash = await bcrypt.hash("supersecurepassword", 10);
      await this.userRepository.save({
        name: "Super Admin",
        username: "admin",
        avartar: "",
        email: "admin@example.com",
        password: passwordHash,
        role: UserRoleEnum.ADMIN
      });
      console.log("✅ Superuser created!");
    } else {
      console.log("⚡ Superuser already exists.");
    }
  }
}
