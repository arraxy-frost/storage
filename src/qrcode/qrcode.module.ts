import { Module } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { QrcodeController } from './qrcode.controller';

@Module({
  providers: [QrcodeService],
  controllers: [QrcodeController]
})
export class QrcodeModule {}
