import { Controller, Get, Query } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
    constructor(private readonly qrcodeService: QrcodeService) {}

    @Get()
    async getQrCode(@Query('data') data: string) {
        return await this.qrcodeService.generateQrCode(data)
    }
}
