import { Controller, Get, Header, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService
    ) {}

    @Get(":fileName")
    async loadPhoto(@Res() res: Response, @Param('fileName') fileName: string) {
        res.redirect(`${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('api-key'))
    async postImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        let fileName = await this.imageService.uploadObject(file);
        return `${req.protocol}://${req.get('Host')}${req.originalUrl}/qr/${fileName}`
    }

    @Get("qr/:fileName")
    @Header('Content-Type', 'image/png')
    async getQrCode(@Req() req: Request, @Res() res: Response, @Param('fileName') fileName: string) {
        let base64 = await this.imageService.generateQrCode(`${req.protocol}://${req.get('Host')}/image/${fileName}`)
        const img = Buffer.from(base64.split(",")[1], 'base64')

        res.end(img);
    }
}
