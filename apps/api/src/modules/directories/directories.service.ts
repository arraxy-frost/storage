import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CreateDirectoryDto } from './directories.dto';
import { PaginatedRequestDto } from '../../common/dto/paginated-request.dto';

@Injectable()
export class DirectoriesService {
    private logger = new Logger('DirectoriesService');

    constructor(private readonly prismaService: PrismaService) {}

    async createDirectory(data: CreateDirectoryDto) {
        const newDirectory = await this.prismaService.directory.create({
            data,
        });

        this.logger.log(
            `Created new directory ${JSON.stringify(newDirectory)}`,
        );

        return newDirectory;
    }

    async getDirectories(query: PaginatedRequestDto) {
        const { limit = 15, page = 1 } = query;

        const items = await this.prismaService.directory.findMany({
            take: limit,
            skip: (page - 1) * limit,
        });

        const total = await this.prismaService.directory.count();

        return {
            total,
            limit,
            page,
            totalPage: Math.ceil(total / limit),
            items,
        };
    }
}
