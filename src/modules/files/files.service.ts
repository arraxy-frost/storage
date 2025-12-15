import { Injectable, InternalServerErrorException, Logger, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { GetFilesDataById, SearchFilesDto } from './files.dto';
import { FileWhereInput } from '../../../generated/prisma/models/File';
import { StorageService } from '../storage/storage.service';
import { MultipartFile } from '@fastify/multipart';
import { createHash } from 'crypto';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
    ) {}

    private async compressImage(inputBuffer: Buffer) {
        return sharp(inputBuffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({ quality: 90 })
            .toBuffer();
    }

    async uploadFile(file: MultipartFile) {
        let buffer = await file.toBuffer();
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

        const id = uuidv4();
        const prefix = null;
        const originalName = file.filename;
        const mimeType = file.mimetype;
        const extension = extname(originalName);

        if (mimeType.startsWith('image/')) {
            buffer = await this.compressImage(buffer);
        }

        const size = buffer.length;

        try {
            const url = await this.storageService.uploadFile(
                `${id}${extension}`,
                buffer,
                mimeType,
            );

            return this.prisma.file.create({
                data: {
                    id,
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

    async getFiles(query: SearchFilesDto) {
        const limit = Number(query.limit ?? 10);
        const page = Number(query.page ?? 1);

        const where: FileWhereInput = {};

        if (query.name?.trim()) {
            where.originalName = {
                contains: query.name?.trim(),
            };
        }

        if (query.id) {
            where.id = query.id;
        }

        if (query.mimeType?.trim()) {
            where.mimeType = {
                startsWith: query.mimeType?.trim(),
            };
        }

        if (query.url) {
            where.url = query.url;
        }

        if (query.directoryId) {
            where.directoryId = query.directoryId;
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

    async getFilesByIds(query: GetFilesDataById) {
        return this.prisma.file.findMany({
            where: {
                id: {
                    in: query.ids
                }
            }
        })
    }

    async deleteFileById(id: string) {
        const file = await this.prisma.file.findFirst({
            where: {
                id,
            },
        });

        if (!file) {
            this.logger.log('Error deleting file: not found', id);
            throw new NotFoundException('File not found');
        }

        try {
            const key = file.id + file.extension;

            await this.storageService.deleteFile(key);

            await this.prisma.file.delete({
                where: {
                    id: file.id,
                },
            });

            return file;
        } catch (e) {
            this.logger.error('Error deleting file', file.id);
            throw new InternalServerErrorException(e.message);
        }
    }
}
