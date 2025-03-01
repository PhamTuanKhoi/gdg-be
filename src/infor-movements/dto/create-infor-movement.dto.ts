import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateInforMovementDto {
  @ApiProperty({ example: 'John Doe', description: 'Tên chủ sở hữu' })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Địa chỉ',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Technician Name', description: 'Kỹ thuật viên' })
  @IsString()
  technician: string;

  @ApiProperty({
    example: '2024-03-01T12:00:00Z',
    description: 'Ngày di chuyển',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    example: '2024-03-05T12:00:00Z',
    description: 'Ngày kết thúc di chuyển',
  })
  @Type(() => Date)
  @IsDate()
  toDate: Date;

  @ApiProperty({ example: 'Hanoi', description: 'Vị trí hiện tại' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Ho Chi Minh', description: 'Vị trí đến' })
  @IsString()
  toLocation: string;

  @ApiProperty({
    example: 'base64string',
    description: 'Chữ ký',
    required: false,
  })
  @IsString()
  @IsOptional()
  signature?: string;

  @ApiProperty({ example: 100, description: 'Tổng số lượng' })
  @IsInt()
  total: number;

  @ApiProperty({
    example: 'QC Name',
    description: 'QC xác nhận khi lấy thiết bị',
  })
  @IsString()
  qcVerifyingRemoving: string;

  //   @ApiProperty({
  //     example: 'QC Name',
  //     description: 'QC xác nhận khi trả thiết bị',
  //   })
  //   @IsString()
  //   qcVerifyingReturning: string;

  @ApiProperty({
    example: 'Some notes',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 100, description: 'removingTech id' })
  @IsInt()
  removingTech_id: number;
}
