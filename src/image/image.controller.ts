import { Controller, Get, Header, Ip, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
    ) {}


    @Get(":fileName")
    async loadPhoto(@Res() res: Response, @Ip() ip, @Param('fileName') fileName: string) {
        res.redirect(`${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('api-key'))
    async postImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        let fileName = await this.imageService.uploadObject(file);
        return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`
    }

    // @Get("qr/:fileName")
    // // @UseGuards(AuthGuard('api-key'))
    // @Header('Content-Type', 'image/png')
    // async getQrCode(@Req() req: Request, @Res() res: Response, @Param('fileName') fileName: string) {
    //     // let fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`
    //     let base64 = await this.imageService.generateQrCode(`${req.protocol}://${req.get('Host')}/image/${fileName}`)
    //     const img = Buffer.from(base64.split(",")[1], 'base64')

    //     // return await this.imageService.generateQrCode(fileUrl)
    //     res.end(img);
    // }
}
