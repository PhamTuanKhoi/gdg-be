import { Module } from '@nestjs/common';
import { TakeawayInforService } from './takeaway-infor.service';
import { TakeawayInforController } from './takeaway-infor.controller';

@Module({
  controllers: [TakeawayInforController],
  providers: [TakeawayInforService],
})
export class TakeawayInforModule {}
