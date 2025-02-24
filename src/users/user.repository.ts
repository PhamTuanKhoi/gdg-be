import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm'; 
import { User } from './entities/user.entity';
import { UserQueryDto } from './dto/query-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({
    query,
    order,
    key,
    pageIndex = 1,
    pageSize = 10,
  }: UserQueryDto): Promise<{ total: number; pageIndex: number; pageSize: number; data: User[] }> {
    const where: FindOptionsWhere<User>[] = [];

    // ✅ Apply full-text search on all columns
    if (query) {
      where.push(
        { name: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { phone: ILike(`%${query}%`) },
        { role: ILike(`%${query}%`) },
        { position: ILike(`%${query}%`) },
      );
    }
    
    // ✅ Use findAndCount to reduce query times
    const [data, total] = await this.userRepository.findAndCount({
      where: where.length ? where : undefined,
      order:  key ? { [key]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }

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
