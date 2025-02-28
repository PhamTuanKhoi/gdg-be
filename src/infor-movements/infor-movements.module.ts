import { Module } from '@nestjs/common';
import { InforMovementsService } from './infor-movements.service';
import { InforMovementsController } from './infor-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InforMovement } from './entities/infor-movement.entity';
import { DeviceInOut } from './entities/device-in-out.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InforMovement, DeviceInOut])],
  controllers: [InforMovementsController],
  providers: [InforMovementsService],
})
export class InforMovementsModule {}
