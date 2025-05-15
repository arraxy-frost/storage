import { ApiProperty } from '@nestjs/swagger'

export class ResponseDeleteDto {
    @ApiProperty({
        description: 'Deletion status',
        type: Boolean,
    })
    success: boolean
    @ApiProperty({
        description: 'S3 request ID',
        type: String,
        example: 'tx000007b7ad6a48d59fff3-006825d369-12b2e58b-ru-1',
    })
    requestId: string
}