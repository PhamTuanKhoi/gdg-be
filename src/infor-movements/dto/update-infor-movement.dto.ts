import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateInforMovementDto } from './create-infor-movement.dto';
import { ArrayNotEmpty, IsArray, IsInt, IsString } from 'class-validator';

export class UpdateInforMovementDto extends PartialType(
  OmitType(CreateInforMovementDto, ['removingTech_id', 'device_ids'] as const),
) {
  @ApiProperty({ example: 200, description: 'returningTech id' })
  @IsInt()
  returningTech_id: number;

  @ApiProperty({
    example: 'QC Name',
    description: 'QC xác nhận khi trả thiết bị',
  })
  @IsString()
  qcVerifyingReturning: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID in out của thiết bị',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // Kiểm tra từng phần tử trong mảng là số nguyên
  deviceInOut_ids: number[];
}
