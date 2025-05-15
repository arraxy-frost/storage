import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadFileDto {
    @ApiProperty({
        description: 'The name of the file to be uploaded. If not provided, a uuid will be generated.',
        type: String,
        example: 'custom-filename.jpg',
        required: false
    })
    @IsOptional()
    @IsString()
    fileName?: string;
}