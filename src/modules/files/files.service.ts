import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { SearchFilesDto } from './files.dto';
import { FileWhereInput } from '../../../generated/prisma/models/File';

@Injectable()
export class FilesService {
    constructor(private readonly prisma: PrismaService) {}

    async getFiles(query: SearchFilesDto) {
        const limit = Number(query.limit ?? 10);
        const page = Number(query.page ?? 1);

        const where: FileWhereInput = {};

        if (query.name?.trim()) {
            where.originalName = {
                contains: query.name?.trim(),
                mode: 'insensitive'
            };
        }

        if (query.id) {
            where.id = query.id;
        }

        if (query.mimeType?.trim()) {
            where.mimeType = {
                startsWith: query.mimeType?.trim(),
                mode: 'insensitive'
            }
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
            this.prisma.file.count({ where })
        ]);

        return {
            total,
            limit,
            page,
            totalPage: Math.ceil(total / limit),
            items,
        };
    }
}
