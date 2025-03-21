import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DeviceCalibrationEnum } from '../enums/device.calibration.enum';
import { DeviceStatusEnum } from '../enums/device.status.enum';
import { DeviceTypeEnum } from '../enums/device.type.enum';

export class DeviceQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số lượng device mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tất cả các field' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc', ''] })
  @IsOptional()
  @IsIn(['asc', 'desc', ''])
  order?: 'asc' | 'desc' | '';

  @ApiPropertyOptional({ example: 'id', description: 'Cột sắp xếp' })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hiệu chuẩn' })
  @IsOptional()
  @IsEnum(DeviceCalibrationEnum)
  statusFilter?: DeviceCalibrationEnum;

  @ApiPropertyOptional({ description: 'Trạng thái thiết bị' })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceStatusEnum)
  status?: DeviceStatusEnum;

  @ApiPropertyOptional({
    description: 'Danh sách kiểu thiết bị',
    type: [Number],
    enum: Object.values(DeviceTypeEnum),
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceTypeEnum, { each: true })
  type?: DeviceTypeEnum[];
}
