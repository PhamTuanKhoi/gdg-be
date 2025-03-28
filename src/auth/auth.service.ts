/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);

      if (!user) throw new HttpException(`Username không tồn tại !`, HttpStatus.NOT_FOUND);

      const match_email = await bcrypt.compare(pass, user?.password);

      if (!match_email) throw new HttpException(`Mật khẩu không đúng!`, HttpStatus.BAD_GATEWAY);

      if (user && match_email) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.usersService.findByUsername(loginUserDto.username);
      const payload = {
        id: user.id,
        email: user.name,
      };

      const { password, ...rest } = user;

      return {
        access_token: this.jwtService.sign(payload),
        user: rest,
      };
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }

  async verifyJwt(token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException();
      }

      const { id, exp } = await this.jwtService.verifyAsync(token);

      const data = await this.usersService.findById(id);
      if (!data) {
        throw new UnauthorizedException();
      }
      return {
        user: { id, name: data.name, username: data.username, role: data.role },
        exp,
      };
    } catch (error) {
      this.logger.log(error);
      throw new UnauthorizedException();
    }
  }
}
