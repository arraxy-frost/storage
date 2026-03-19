import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { CreateDirectoryDto } from './directories.dto';
import { PaginatedRequestDto } from '../../common/dto/paginated-request.dto';

@Controller('directories')
export class DirectoriesController {
    private logger = new Logger('DirectoriesController');

    constructor(private directories: DirectoriesService) {}

    @Post()
    async createDirectory(@Body() body: CreateDirectoryDto) {
        return this.directories.createDirectory(body);
    }

    @Get()
    async getDirectories(@Query() query: PaginatedRequestDto) {
        return this.directories.getDirectories(query)
    }
}
