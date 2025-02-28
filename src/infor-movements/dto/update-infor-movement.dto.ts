import { PartialType } from '@nestjs/swagger';
import { CreateInforMovementDto } from './create-infor-movement.dto';

export class UpdateInforMovementDto extends PartialType(CreateInforMovementDto) {}
