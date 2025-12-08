import {
    BadRequestException,
    Controller,
    Get,
    Logger,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import type { FastifyRequest } from 'fastify';
import { extname } from 'path';
import { PrismaService } from '../../shared/prisma.service';
import { createHash } from 'crypto';
import { File } from '../../../generated/prisma/client';
import { SearchFilesDto } from './files.dto';

@Controller('files')
export class FilesController {
    private readonly logger = new Logger(FilesService.name);

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
        const file = await req.file();

        if (!file) {
            throw new BadRequestException('File not provided');
        }

        const buffer = await file.toBuffer();
        const hash = createHash('sha256').update(buffer).digest('hex');

        const existedFile = await this.prisma.file.findFirst({
            where: {
                hash,
            },
        });

        if (existedFile) {
            this.logger.log('Return existed file');
            return existedFile;
        }

        const prefix = null;
        const originalName = file.filename;
        const mimeType = file.mimetype;
        const size = buffer.length;
        const extension = extname(originalName);
        const url = `/uploads/${prefix}/${originalName}`;

        return this.prisma.file.create({
            data: {
                prefix,
                originalName,
                extension,
                mimeType,
                size,
                url,
                hash,
            },
        });
    }
}
