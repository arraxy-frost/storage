import { Injectable, Logger } from '@nestjs/common';
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

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

        const fileUrl = `${this.ENDPOINT}/${this.BUCKET_NAME}/${key}`;

        this.logger.log(`Uploaded file: ${fileUrl}`);

        return fileUrl;
    }

    async uploadStream(
        key: string,
        stream: Readable,
        contentType: string,
    ): Promise<string> {
        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.BUCKET_NAME,
                Key: key,
                Body: stream,
                ContentType: contentType,
                // ⛔ НЕ ContentLength
            },
            queueSize: 4,
            partSize: 10 * 1024 * 1024, // 10 MB
            leavePartsOnError: false,
        });

        await upload.done();

        return `${this.ENDPOINT}/${this.BUCKET_NAME}/${key}`;
    }

    async deleteFile(key: string) {
        const deletionResult = this.client.send(
            new DeleteObjectCommand({
                Bucket: this.BUCKET_NAME,
                Key: key,
            }),
        );

        this.logger.log(`Deleted file: ${key}`);

        return deletionResult;
    }
}
