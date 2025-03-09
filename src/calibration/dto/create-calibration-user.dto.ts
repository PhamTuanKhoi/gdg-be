import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCalibrationUserDto {
  @ApiProperty({
    description: 'ID của user để kiểm tra trạng thái đã xem',
    example: '3',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID của calibration',
    example: '2',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  calibrationId: number;
}
