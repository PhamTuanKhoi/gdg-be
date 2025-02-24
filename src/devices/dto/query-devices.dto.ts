import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer'; 

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

  @ApiPropertyOptional({ example: 'thiet bi', description: 'Tìm kiếm theo tất cả các field' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc', ''] })
  @IsOptional()
  @IsIn(['asc', 'desc', ''])
  order?: 'asc' | 'desc' | '';

  @ApiPropertyOptional({ example: 'code', description: 'Cột sắp xếp' })
  @IsOptional()
  @IsString()
  key?: string;
}

