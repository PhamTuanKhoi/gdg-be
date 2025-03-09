import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

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

  @ApiProperty({
    description: 'ID của user để kiểm tra trạng thái đã xem',
    example: '3',
    type: String,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;
}
