import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'; 
import { AuthService } from './auth.service'; 
import { JwtAuthGuard } from './guard/jwt-auth.guard';  
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
 

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  } 

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@Request() req) {
  //   return await this.authService.profile(req.user);
  // }
 
}
