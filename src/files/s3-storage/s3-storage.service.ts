import { Injectable } from '@nestjs/common'
import { IStorageService } from '../../common/interfaces/storage.interface'
import { randomUUID } from 'crypto'
import {
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    DeleteObjectCommandOutput,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput
} from '@aws-sdk/client-s3'
import { InjectS3, S3 } from 'nestjs-s3'
import { ResponseDeleteDto } from './dto/response-delete.dto'

@Injectable()
export class S3StorageService implements IStorageService {
    constructor(@InjectS3() private readonly s3: S3) {}

    async deleteObject(key: string): Promise<ResponseDeleteDto> {
        const input: DeleteObjectCommandInput = {
            Bucket: process.env.S3_BUCKET,
            Key: key
        };

        try {
            const output: DeleteObjectCommandOutput = await this.s3.send(
                new DeleteObjectCommand(input)
            );

            const response: ResponseDeleteDto = new ResponseDeleteDto();

            response.success = output.$metadata.httpStatusCode === 204;
            response.requestId = output.$metadata.requestId;

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getObject(key: string): Promise<Buffer> {
        return Promise.resolve(undefined)
    }

    async getObjectUrl(key: string): Promise<string> {
        return `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT}/${key}`
    }

    async listObjects(): Promise<string[]> {
        const input: ListObjectsV2CommandInput = {
            Bucket: process.env.S3_BUCKET
        }

        try {
            const response: ListObjectsV2CommandOutput = await this.s3.send(
                new ListObjectsV2Command(input)
            )

            if (response.Contents) {
                return response.Contents.map((item) => item.Key).filter(Boolean) as string[]
            }

            return []
        } catch (err) {
            throw err
        }
    }

    async uploadObject(file: Express.Multer.File, fileName: string): Promise<string> {
        const key = !!fileName ? fileName : randomUUID();

        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }

        try {
            const response: PutObjectCommandOutput = await this.s3.send(new PutObjectCommand(input))

            if (response.$metadata.httpStatusCode === 200) {
                return key
            }
        } catch (err) {
            throw err
        }
    }
}
