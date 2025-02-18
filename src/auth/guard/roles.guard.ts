// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { UserRoleEnum } from 'src/user/enum/user.role.enum';
// import { ROLES_KEY } from '../decorator/roles.decorator';
// import { log } from 'console';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private readonly authService: AuthService,
//   ) {}

//   async canActivate(context: ExecutionContext) {
//     const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );
//     if (!requiredRoles) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();

//     const authHeader = request.headers['authorization'];

//     if (!authHeader) throw new UnauthorizedException();

//     const authPath = authHeader.split(' '); // ['bearer', 'token']

//     if (authPath.length !== 2) throw new UnauthorizedException();

//     const [, jwt] = authPath;

//     const { user } = await this.authService.verifyJwt(jwt);

//     return true;
//     // return requiredRoles.some((role) => user.role?.includes(role));
//   }
// }
