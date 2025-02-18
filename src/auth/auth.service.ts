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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(email);

    return user

    // if (!user)
    //   throw new HttpException(`Email không tồn tại !`, HttpStatus.NOT_FOUND);

    // const match_email = await bcrypt.compare(
    //   pass,
    //   user?.password.replace('$2y$', '$2a$'),
    // );

    // if (!match_email)
    //   throw new HttpException(`Mật khẩu không đúng!`, HttpStatus.BAD_GATEWAY);

    // if (user && match_email) {
    //   const { password, ...result } = user;
    //   return result;
    // }

    // return null;
  } 
  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByUsername(loginUserDto.username); 

    // if (!user || user.role != 2) {
    //   throw new UnauthorizedException();
    // }

    const payload = {
      email: user.name, 

      //chỉ giáo viên
      role: 'teacher',
    };

    const dataUser = { username: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: dataUser,
    };
  }

  
}
