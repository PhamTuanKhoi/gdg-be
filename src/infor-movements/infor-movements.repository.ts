import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/abstract.repository';
import { InforMovement } from './entities/infor-movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class InforMovementsRepository extends BaseRepository<InforMovement> {
  constructor(
    @InjectRepository(InforMovement)
    private readonly inforMovementRepository: Repository<InforMovement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(inforMovementRepository);
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
