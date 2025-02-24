import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { editFileName, imageFileFilter } from './upload.utils';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  @Post('/')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const response = {
        originalname: file.originalname,
        filename: file.filename,
        url: `upload/${file.filename}`,
      };
      return response;
    } catch (e: any) {
      console.log(e);
    }
  }

  @Get('*')
  seeUploadedFile(@Req() req, @Res() res) {
    // Lấy toàn bộ đường dẫn sau /upload/ (bao gồm cả dấu "/")
    const filePath = req.url.replace('/upload/', '');
    console.log('Request file:', filePath);
    return res.sendFile(filePath, { root: path.resolve(process.cwd(), 'uploads') });
  }
}