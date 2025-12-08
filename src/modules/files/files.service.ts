import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { SearchFilesDto } from './files.dto';
import { FileWhereInput } from '../../../generated/prisma/models/File';
import { StorageService } from '../storage/storage.service';
import { MultipartFile } from '@fastify/multipart';
import { createHash } from 'crypto';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
    ) {}

    async getFiles(query: SearchFilesDto) {
        const limit = Number(query.limit ?? 10);
        const page = Number(query.page ?? 1);

        const where: FileWhereInput = {};

        if (query.name?.trim()) {
            where.originalName = {
                contains: query.name?.trim(),
                mode: 'insensitive',
            };
        }

        if (query.id) {
            where.id = query.id;
        }

        if (query.mimeType?.trim()) {
            where.mimeType = {
                startsWith: query.mimeType?.trim(),
                mode: 'insensitive',
            };
        }

        if (query.url) {
            where.url = query.url;
        }

        const [items, total] = await Promise.all([
            this.prisma.file.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
            }),
            this.prisma.file.count({ where }),
        ]);

        return {
            total,
            limit,
            page,
            totalPage: Math.ceil(total / limit),
            items,
        };
    }

    async uploadFile(file: MultipartFile) {
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

        const key = uuidv4();
        const prefix = null;
        const originalName = file.filename;
        const mimeType = file.mimetype;
        const size = buffer.length;
        const extension = extname(originalName);

        try {
            const url = await this.storageService.uploadFile(
                `${key}${extension}`,
                buffer,
                mimeType,
            );

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
        } catch (error: any) {
            this.logger.error('Error uploading file');
            throw new InternalServerErrorException(error.message);
        }
    }
}
