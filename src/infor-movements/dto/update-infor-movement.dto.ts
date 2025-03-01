import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateInforMovementDto } from './create-infor-movement.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateInforMovementDto extends PartialType(
  OmitType(CreateInforMovementDto, ['removingTech_id'] as const),
) {
  @ApiProperty({ example: 200, description: 'returningTech id' })
  @IsOptional()
  @IsInt()
  returningTech_id: number;

  @ApiProperty({
    example: 'QC Name',
    description: 'QC xác nhận khi trả thiết bị',
  })
  @IsOptional()
  @IsString()
  qcVerifyingReturning: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID in out của thiết bị',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  deviceInOut_ids: number[];

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID của thiết bị',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  device_ids: number[];
}
