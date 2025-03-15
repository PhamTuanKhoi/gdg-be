import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CommonQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex?: number = 1;

  @ApiPropertyOptional({
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    example: 'john',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc', ''] })
  @IsOptional()
  @IsIn(['asc', 'desc', ''])
  order?: 'asc' | 'desc' | '' = 'asc';

  @ApiPropertyOptional({ example: 'username' })
  @IsOptional()
  @IsString()
  key?: string;
}
