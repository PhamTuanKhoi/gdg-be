import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString, IsDateString } from 'class-validator';
import { DeviceQueryDto } from './query-devices.dto';
import { Type } from 'class-transformer';

export class DeviceHistoryQueryDto extends DeviceQueryDto {
  @ApiPropertyOptional({
    description: 'Mảng các ngày để lọc (định dạng YYYY-MM-DD)',
    example: ['2025-03-15', '2025-03-29'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Đảm bảo mỗi phần tử là chuỗi
  @IsDateString({ strict: true }, { each: true }) // Kiểm tra định dạng ngày hợp lệ
  @Type(() => String) // Chuyển đổi giá trị từ request thành chuỗi
  date?: string[];
}
