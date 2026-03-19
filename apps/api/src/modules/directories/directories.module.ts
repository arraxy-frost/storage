import { Module } from '@nestjs/common';
import { DirectoriesController } from './directories.controller';
import { DirectoriesService } from './directories.service';
import { PrismaService } from '../../shared/prisma.service';

@Module({
    imports: [],
    controllers: [DirectoriesController],
    providers: [DirectoriesService, PrismaService],
})
export class DirectoriesModule {}
