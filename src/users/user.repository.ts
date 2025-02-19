import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByField(field: keyof User, value: any): Promise<User | null> {
    return await this.userRepository.findOne({ where: { [field]: value } });
  }

  async findById(id: number): Promise<User | null> {
    return this.findOneByField('id', id);
  }

  async save(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user) as User;  
  }

  async updateUser(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);  
  }
}
