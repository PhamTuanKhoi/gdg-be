// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from '../auth.service';

// export interface CustomRequest {
//   locals: {
//     userId?: string;
//     role?: string;
//   };
// }

// @Injectable()
// export class UserMiddleware implements NestMiddleware {
//   constructor(private readonly authService: AuthService) {}

//   async use(req: CustomRequest & Request, res: Response, next: NextFunction) {
//     const jwt = req.headers['authorization'];

//     if (!jwt) throw new UnauthorizedException();

//     const { user } = await this.authService.verifyJwtUser(jwt);

//     // Thêm thông tin vào req.locals để sử dụng trong interceptor
//     req.locals = {
//       userId: user?.id,
//       role: user?.role?.toString(),
//     };

//     next();
//   }
// }
