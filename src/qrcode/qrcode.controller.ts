import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('qrcode')
export class QrcodeController {
    constructor(private readonly qrcodeService: QrcodeService) {}

    @Get()
    // @UseGuards(AuthGuard('api-key'))
    async getQrCode(@Query('data') data: string) {
        return await this.qrcodeService.generateQrCode(data)
    }
}
