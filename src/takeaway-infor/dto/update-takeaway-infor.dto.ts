import { PartialType } from '@nestjs/swagger';
import { CreateTakeawayInforDto } from './create-takeaway-infor.dto';

export class UpdateTakeawayInforDto extends PartialType(CreateTakeawayInforDto) {}
