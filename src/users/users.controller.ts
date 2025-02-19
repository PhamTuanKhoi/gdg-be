import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRoleEnum } from './enums/user.role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'

@ApiBearerAuth()
@ApiTags('User') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo user mới với avatar' })
  @ApiResponse({ status: 201, description: 'User đã được tạo.' })
  @ApiResponse({ status: 409, description: 'Username, email hoặc phone đã tồn tại.' })
  @ApiConsumes('multipart/form-data') // 📌 Quan trọng để Swagger nhận diện file upload
  @ApiBody({
    description: 'Thông tin user và avatar',
    type: CreateUserDto,
  })
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
  }))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    return this.usersService.createUser(createUserDto, avatarFile);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật user' })
  @ApiResponse({ status: 200, description: 'User đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'User không tồn tại.' })
  @ApiConsumes('multipart/form-data') // ✅ Quan trọng để Swagger hiển thị file upload
  @ApiBody({
    description: 'Thông tin user và avatar',
    type: UpdateUserDto,
  })
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
  }))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatarFile?: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, avatarFile);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
