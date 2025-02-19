import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiPropertyOptional({ example: 'johndoe@example.com' })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({ example: '+84123456789' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    phone?: string;

    @ApiPropertyOptional({ example: 'admin' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string;

    @ApiPropertyOptional({ example: 'Software Engineer' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    position?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' }) // ✅ Swagger hỗ trợ upload file
    @IsOptional()
    avatar?: any;
}
