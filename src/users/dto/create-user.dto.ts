import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 'johndoe', uniqueItems: true })
    @IsString()
    @MaxLength(100)
    username: string;

    @ApiProperty({ example: 'johndoe@example.com', uniqueItems: true })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({ example: '+84123456789', uniqueItems: true })
    @IsString()
    @MaxLength(100)
    phone: string;

    @ApiProperty({ example: 'strongpassword123' })
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' }) // ✅ Để Swagger hiển thị input upload file
    @IsOptional()
    avatar?: any;
}
