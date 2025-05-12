import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3'
import { randomUUID } from 'crypto'

@Injectable()
export class FilesService {
    constructor(@InjectS3() private readonly s3: S3,) {}

    async uploadObject(file: Express.Multer.File): Promise<string> {
        let key = randomUUID();

        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }

        try {
            const response: PutObjectCommandOutput =
                await this.s3.send(new PutObjectCommand(input))

            if (response.$metadata.httpStatusCode === 200) {
                return key
            }
        }
        catch (err) {
            throw err
        }
    }
}
