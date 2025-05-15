import { Module } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Module({
  providers: [QrcodeService]
})
export class QrcodeModule {}
