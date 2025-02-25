import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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
    type: 'string',
    example: 'Hanoi, Vietnam',
    description: 'Location',
  })
  @IsOptional()
  @IsString()
  location?: string;

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
    example: 'Type A',
    description: 'Device type',
  })
  @IsOptional()
  @IsString()
  type?: string;

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
    type: 'string',
    example: 'active',
    description: 'Status of the device',
  })
  @IsOptional()
  @IsString()
  status?: string;

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
