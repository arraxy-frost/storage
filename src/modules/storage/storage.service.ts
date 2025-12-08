import { Injectable, Logger } from '@nestjs/common';
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    private readonly logger = new Logger('S3-Service');
    private readonly client: S3Client;
    private readonly BUCKET_NAME: string;
    private readonly ENDPOINT: string;

    constructor(private readonly config: ConfigService) {
        this.BUCKET_NAME = this.config.getOrThrow<string>('S3_BUCKET');
        this.ENDPOINT = this.config.getOrThrow<string>('S3_ENDPOINT');

        this.client = new S3Client({
            region: this.config.getOrThrow<string>('S3_REGION'),
            credentials: {
                accessKeyId: this.config.getOrThrow<string>('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.config.getOrThrow<string>('S3_SECRET'),
            },
            endpoint: this.ENDPOINT,
        });
    }

    async uploadFile(key: string, body: Buffer, contentType: string) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
                Body: body,
                ContentType: contentType,
            }),
        );

        return `${this.ENDPOINT}/${this.BUCKET_NAME}/${key}`;
    }

    async deleteFile(key: string) {
        console.log(key);

        return this.client.send(
            new DeleteObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
            }),
        );
    }
}
