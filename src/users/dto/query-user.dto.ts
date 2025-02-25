import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonQueryDto } from 'src/common/dto/CommonQuery';

export class UserQueryDto extends CommonQueryDto {
  @ApiPropertyOptional({ example: '["1"]' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  roles?: string[];
}
