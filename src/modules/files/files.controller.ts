import {
    BadRequestException,
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
import { SearchFilesDto } from './files.dto';
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
    async uploadFile(@Req() req: FastifyRequest): Promise<File> {
        const file: MultipartFile | undefined = await req.file();

        if (!file) {
            throw new BadRequestException('File not provided');
        }

        return this.fileService.uploadFile(file);
    }

    @Delete(':fileId')
    async deleteFileById(@Param('fileId') fileId: string) {
        return this.fileService.deleteFileById(fileId);
    }
}
