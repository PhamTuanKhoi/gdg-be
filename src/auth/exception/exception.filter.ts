// exception.filter.ts

import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const res: any = exception.getResponse();
    if (res.statusCode == HttpStatus.NOT_FOUND) {
      return response.status(HttpStatus.NOT_FOUND).render('page/404');
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: exception.getStatus(),
      message: res,
    });
  }
}
