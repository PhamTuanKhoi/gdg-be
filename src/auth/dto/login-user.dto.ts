import { ApiProperty } from '@nestjs/swagger';
import { IsString, minLength, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsString() 
  username: string;

  @ApiProperty()
  @IsString()
  password: number;
}
