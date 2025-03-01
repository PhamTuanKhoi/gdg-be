import { Module } from '@nestjs/common';
import { InforMovementsService } from './infor-movements.service';
import { InforMovementsController } from './infor-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InforMovement } from './entities/infor-movement.entity';
import { DeviceInOut } from './entities/device-in-out.entity';
import { InforMovementsRepository } from './infor-movements.repository';
import { User } from 'src/users/entities/user.entity';
import { Device } from 'src/devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InforMovement, DeviceInOut, User, Device]),
  ],
  controllers: [InforMovementsController],
  providers: [InforMovementsService, InforMovementsRepository],
})
export class InforMovementsModule {}
