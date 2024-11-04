import { Controller, Get, Query } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get()
    async getImage() {
        let result = await this.imageService.getListObjects()
        return result.Contents
    }

    @Get("qrcode")
    async getQrCode(@Query('data') data: string) {
        return await this.imageService.generateQrCode(data)
    }
}
