import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { Express, Request } from 'express'
import { FilesService } from './files.service'
import * as process from 'node:process'

@Controller({
    path: 'files',
    version: '1'
})
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('api-key'))
    async postImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        let fileName = await this.filesService.uploadObject(file);
        return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`
    }
}
