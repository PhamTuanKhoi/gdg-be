/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user)
      throw new HttpException(`Username không tồn tại !`, HttpStatus.NOT_FOUND);

    const match_email = await bcrypt.compare(
      pass, user?.password,
    );
    
    if (!match_email)
      throw new HttpException(`Mật khẩu không đúng!`, HttpStatus.BAD_GATEWAY);

    if (user && match_email) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  } 

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByUsername(loginUserDto.username); 
    const payload = {
      email: user.name, 
    };
 
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.name },
    };
  }

  
}
