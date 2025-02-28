import { Injectable } from '@nestjs/common';
import { CreateInforMovementDto } from './dto/create-infor-movement.dto';
import { UpdateInforMovementDto } from './dto/update-infor-movement.dto';

@Injectable()
export class InforMovementsService {
  create(createInforMovementDto: CreateInforMovementDto) {
    return 'This action adds a new inforMovement';
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
