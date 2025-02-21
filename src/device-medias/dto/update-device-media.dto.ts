import { PartialType } from '@nestjs/swagger';
import { CreateDeviceMediaDto } from './create-device-media.dto';

export class UpdateDeviceMediaDto extends PartialType(CreateDeviceMediaDto) {}
