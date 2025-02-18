import { IsString, minLength, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  password: number;
}
