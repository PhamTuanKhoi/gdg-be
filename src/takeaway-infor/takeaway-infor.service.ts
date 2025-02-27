import { Injectable } from '@nestjs/common';
import { CreateTakeawayInforDto } from './dto/create-takeaway-infor.dto';
import { UpdateTakeawayInforDto } from './dto/update-takeaway-infor.dto';

@Injectable()
export class TakeawayInforService {
  create(createTakeawayInforDto: CreateTakeawayInforDto) {
    return 'This action adds a new takeawayInfor';
  }

  findAll() {
    return `This action returns all takeawayInfor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} takeawayInfor`;
  }

  update(id: number, updateTakeawayInforDto: UpdateTakeawayInforDto) {
    return `This action updates a #${id} takeawayInfor`;
  }

  remove(id: number) {
    return `This action removes a #${id} takeawayInfor`;
  }
}
