import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserQueryDto } from './dto/query-user.dto';
import { BaseRepository } from 'src/database/abstract.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async findAll({
    query,
    order,
    key,
    pageIndex = 1,
    pageSize = 10,
    roles,
  }: UserQueryDto): Promise<{
    total: number;
    pageIndex: number;
    pageSize: number;
    data: User[];
  }> {
    const where: FindOptionsWhere<User>[] = [];

    // ✅ Apply full-text search on all columns
    if (query) {
      where.push(
        { name: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { phone: ILike(`%${query}%`) },
        { position: ILike(`%${query}%`) },
      );
    } 
    
    where.push({
      role: Not(3)
    })  
    
    if (roles && roles.length > 0) {
      where.push({ role: In(roles) });
    }
    
    // ✅ Use findAndCount to reduce query times
    const [data, total] = await this.userRepository.findAndCount({
      where: where.length ? where : undefined,
      order: key ? { [key]: order.toUpperCase() as 'ASC' | 'DESC' } : undefined,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return { total, pageIndex: +pageIndex, pageSize: +pageSize, data };
  }
}
