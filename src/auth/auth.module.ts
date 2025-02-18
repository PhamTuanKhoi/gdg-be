import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategy/jwt.strategy'; 
import { UsersModule } from 'src/users/users.module';
// import { RolesGuard } from './guard/roles.guard';


@Module({
  imports: [ 
    UsersModule,
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy], //RolesGuard
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
