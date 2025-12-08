import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class FilesService {
    constructor(private readonly prisma: PrismaService) {}

    async getFiles() {
        return this.prisma.file.findMany();
    }
}
