import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { Express } from 'express'
import { S3StorageService } from './s3-storage.service'
import { ResponseDeleteDto } from './dto/response-delete.dto'
import { UploadFileDto } from './dto/upload-file.dto'
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiSecurity } from '@nestjs/swagger'

@ApiSecurity('apiKey')
@UseGuards(AuthGuard('api-key'))
@Controller({ path: 'files/s3', version: '1' })
export class S3StorageController {
    constructor(private readonly s3StorageService: S3StorageService) {}

    @Get()
    async listObjects(): Promise<string[]> {
        return await this.s3StorageService.listObjects()
    }

    @Post()
    @ApiOperation({ summary: 'Upload object to s3' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File upload with optional fileName as key',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
                fileName: {
                    type: 'string',
                    example: 'some-filename.jpg'
                }
            },
            required: ['file']
        }
    })
    @ApiOkResponse({
        description: 'Returns url to uploaded file',
        schema: {
            type: 'string',
            example: 'https://s3.amazonaws.com/bucket-name/some-file-name'
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadObject(@UploadedFile() file: Express.Multer.File, @Body() options: UploadFileDto) {
        let fileName = await this.s3StorageService.uploadObject(file, options?.fileName)
        return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`
    }

    @ApiOperation({ summary: 'Delete object from s3' })
    @ApiOkResponse({
        description: 'Returns status and request ID',
        type: ResponseDeleteDto
    })
    @Delete(':fileName')
    async deleteObject(@Param('fileName') fileName: string): Promise<ResponseDeleteDto> {
        return await this.s3StorageService.deleteObject(fileName)
    }
}
