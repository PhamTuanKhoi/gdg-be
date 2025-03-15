import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { CommonQueryDto } from 'src/common/dto/CommonQuery';

export class QueryCalibrationDto extends CommonQueryDto {
  @ApiProperty({
    description: 'ID của user để kiểm tra trạng thái đã xem',
    example: '3',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái đã xem (0: chưa xem, 1: đã xem)',
    example: 1,
    enum: [0, 1],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  isViewed?: 0 | 1;
}
