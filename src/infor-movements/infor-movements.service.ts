import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';
import { InforMovementsRepository } from './infor-movements.repository';

@Injectable()
export class InforMovementsService {
  constructor(
    private readonly inforMovementsRepository: InforMovementsRepository,
  ) {}

  async create(createInforMovementDto: CreateInforMovementDto) {
    const user = await this.inforMovementsRepository.findUserById(
      createInforMovementDto.removingTech_id,
    );

    if (!user || user == null || !createInforMovementDto.removingTech_id) {
      throw new NotFoundException('User không tồn tại.');
    }

    return await this.inforMovementsRepository.save({
      ...createInforMovementDto,
      removingTech: user,
    });
  }

  findAll() {
    return `This action returns all inforMovements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inforMovement`;
  }

  update(id: number, updateInforMovementDto: UpdateInforMovementDto) {
    return `This action updates a #${id} inforMovement`;
  }

  remove(id: number) {
    return `This action removes a #${id} inforMovement`;
  }
}
