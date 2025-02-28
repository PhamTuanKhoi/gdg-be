import { Module } from '@nestjs/common';
import { InforMovementsService } from './infor-movements.service';
import { InforMovementsController } from './infor-movements.controller';

@Module({
  controllers: [InforMovementsController],
  providers: [InforMovementsService],
})
export class InforMovementsModule {}
