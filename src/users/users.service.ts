import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './enums/user.role.enum';
import { User } from './entities/user.entity';
import { UserQueryDto } from './dto/query-user.dto';
import { unlink } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    createUserDto: CreateUserDto,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    const { username, email, phone, password } = createUserDto;

    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      this.userRepository.findOneByField('username', username),
      this.userRepository.findOneByField('email', email),
      this.userRepository.findOneByField('phone', phone),
    ]);

    if (existingUsername) throw new ConflictException('Username đã tồn tại.');
    if (existingEmail) throw new ConflictException('Email đã tồn tại.');
    if (existingPhone) throw new ConflictException('Số điện thoại đã tồn tại.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
      avatar: avatarFile ? `/upload/user/${avatarFile.filename}` : null,
    });

    return newUser;
  }

  async findAllUsers(queryDto: UserQueryDto) {
    return this.userRepository.findAll(queryDto);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOneByField('username', username);
  }

  async findById(id: number) {
    return await this.userRepository.findById(id);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User không tồn tại.');
    }

    const [existingEmail, existingPhone] = await Promise.all([
      updateUserDto.email
        ? this.userRepository.findOneByField('email', updateUserDto.email)
        : null,
      updateUserDto.phone
        ? this.userRepository.findOneByField('phone', updateUserDto.phone)
        : null,
    ]);

    if (existingEmail && existingEmail.id !== +id)
      throw new ConflictException('Email đã tồn tại.');
    if (existingPhone && existingPhone.id !== +id)
      throw new ConflictException('Số điện thoại đã tồn tại.');

    if (avatarFile) {
      updateUserDto.avatar = `/upload/user/${user.id}/${avatarFile.filename}`;

      // remove old media
      try {
        await this.unlinkFile(user.avatar);
      } catch (error) {
        console.log('link not found');
      }
    } else {
      delete updateUserDto.avatar;
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async unlinkFile(file: string): Promise<void> {
    if (file && file != null) {
      try {
        // Loại bỏ "upload/" khỏi đường dẫn file nếu nó có
        const filePath = file.replace(/^\/?upload\//, '');
        await unlink(resolve(`./uploads/${filePath}`));
      } catch (error) {
        console.log(`Error: file not found`);
      }
    }
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return true;
  }

  async onApplicationBootstrap() {
    const existingUser = await this.userRepository.findOneByField(
      'username',
      'admin',
    );
    if (!existingUser) {
      const passwordHash = await bcrypt.hash('supersecurepassword', 10);
      await this.userRepository.save({
        name: 'Super Admin',
        username: 'admin',
        email: 'admin@example.com',
        password: passwordHash,
        role: UserRoleEnum.SUPERADMIN,
        phone: '0393877678',
      });
      console.log('✅ Superuser created!');
    } else {
      console.log('⚡ Superuser already exists.');
    }
  }
}
