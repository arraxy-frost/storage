import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) {}

    @Get()
    async getFiles() {
        return this.fileService.getFiles();
    }
}
