import { ApiProperty } from '@nestjs/swagger';

export class ImportResultDto {
  @ApiProperty({ description: 'Số lượng bản ghi được tạo mới' })
  created: number;

  @ApiProperty({ description: 'Số lượng bản ghi được cập nhật' })
  updated: number;
}
