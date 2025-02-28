import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceStatusEnum } from '../enums/device.status.enum';
import { DeviceLocationEnum } from '../enums/device.location.enum';
import { DeviceTypeEnum } from '../enums/device.type.enum';

export class CreateDeviceDto {
  @ApiProperty({
    type: 'string',
    example: 'ABC123',
    description: 'Device code',
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: 'string',
    example: 'Device Name VI',
    description: 'Device name in Vietnamese',
  })
  @IsOptional()
  @IsString()
  name_vi?: string;

  @ApiProperty({
    type: 'string',
    example: 'Device Name EN',
    description: 'Device name in English',
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ type: 'string', example: 'Sony', description: 'Manufacturer' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ type: 'string', example: 'Model X', description: 'Model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    type: 'string',
    example: 'SN123456789',
    description: 'Serial Number',
  })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty({
    enum: DeviceLocationEnum,
    example: DeviceLocationEnum.HCM,
    description: 'Location of the device (0, 1, 2)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceLocationEnum)
  location?: DeviceLocationEnum;

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-01-01',
    description: 'Calibration date',
  })
  @IsOptional()
  @IsDateString()
  last?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-12-31',
    description: 'Calibration end date',
  })
  @IsOptional()
  @IsDateString()
  next?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-12-31',
    description: 'maintenance date',
  })
  @IsOptional()
  maintenanceDate?: Date | null;

  @ApiProperty({
    enum: DeviceTypeEnum,
    example: DeviceTypeEnum.ELECTRONICS,
    description: 'Type of the device (0, 1, 2, 3, 4)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceTypeEnum)
  type?: DeviceTypeEnum;

  @ApiProperty({
    type: 'string',
    example: 'At company ABC',
    description: 'Device place',
  })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiProperty({
    type: 'number',
    example: 12,
    description: 'Period (số tháng hoặc năm tùy theo context)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  period?: number;

  @ApiProperty({
    type: 'number',
    example: 12,
    description: 'Notification Time (ngày thông báo hiệu chuẩn)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  notification_time?: number;

  @ApiProperty({
    enum: DeviceStatusEnum,
    example: DeviceStatusEnum.ON_SITE,
    description: 'Status of the device (0: ON_SITE, 1: AT_LAB)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(DeviceStatusEnum)
  status?: DeviceStatusEnum;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'List of files',
    required: false,
  })
  @IsOptional()
  files?: any[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Certificate file',
    required: false,
  })
  @IsOptional()
  certificate?: any;
}
