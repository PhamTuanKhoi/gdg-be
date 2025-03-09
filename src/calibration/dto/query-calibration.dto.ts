import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryCalibrationDto {
  @ApiProperty({
    description: 'Số lượng bản ghi tối đa cần lấy',
    example: 10,
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex?: number = 1;

  @ApiProperty({
    description: 'ID của user để kiểm tra trạng thái đã xem',
    example: '3',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;
}
