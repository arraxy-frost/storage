import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { PaginatedRequestDto } from '../../common/dto/paginated-request.dto';

@Injectable()
export class FilesService {
    constructor(private readonly prisma: PrismaService) {}

    async getFiles(query: PaginatedRequestDto) {
        const limit = Number(query.limit ?? 10);
        const page = Number(query.page ?? 1);

        const items = await this.prisma.file.findMany({
            take: limit,
            skip: (page - 1) * limit,
        });
        const total = await this.prisma.file.count();

        return {
            total,
            limit,
            page,
            totalPage: Math.ceil(total / limit),
            items,
        }
    }
}
