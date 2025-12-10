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
        const s3Config = config.get('s3');

        this.BUCKET_NAME = s3Config.bucket;
        this.ENDPOINT = s3Config.endpoint;

        this.client = new S3Client({
            region: s3Config.region,
            credentials: {
                accessKeyId: s3Config.accessKeyId,
                secretAccessKey: s3Config.secretAccessKey,
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
        return this.client.send(
            new DeleteObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
            }),
        );
    }
}
