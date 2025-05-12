import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { Express, Request } from 'express'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('api-key'))
    async postImage(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        let fileName = await this.filesService.uploadObject(file);
        return `${req.protocol}://${req.get('Host')}${req.originalUrl}/qr/${fileName}`
    }
}
