import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import type { FastifyRequest } from 'fastify';
import { PrismaService } from '../../shared/prisma.service';
import { File } from '../../../generated/prisma/client';
import {
    GetFilesDataById,
    SearchFilesDto,
    UploadOptionsDto,
} from './files.dto';
import { MultipartFile } from '@fastify/multipart';

@Controller('files')
export class FilesController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileService: FilesService,
    ) {}

    @Get()
    async getFiles(@Query() query: SearchFilesDto) {
        return this.fileService.getFiles(query);
    }

    @Post()
    async uploadFile(
        @Req() req: FastifyRequest,
        @Body() options: UploadOptionsDto,
    ): Promise<File> {
        const file: MultipartFile | undefined = await req.file();

        if (!file) {
            throw new BadRequestException('File not provided');
        }

        return this.fileService.uploadFile(file);
    }

    @Post('image')
    async uploadImage(
        @Req() req: FastifyRequest,
    ): Promise<File> {
        const file: MultipartFile | undefined = await req.file();

        if (!file) {
            throw new BadRequestException('File not provided');
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('File type not allowed');
        }

        return this.fileService.uploadFile(file);
    }

    @Post('search')
    async getFilesDataById(@Body() body: GetFilesDataById) {
        return this.fileService.getFilesByIds(body);
    }

    @Delete(':fileId')
    async deleteFileById(@Param('fileId') fileId: string) {
        return this.fileService.deleteFileById(fileId);
    }
}
