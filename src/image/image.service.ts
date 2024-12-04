import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import * as qrcode from 'qrcode';

const generateUniqueId = require('generate-unique-id');


@Injectable()
export class ImageService {
    constructor(@InjectS3() private readonly s3: S3,) {}

    async generateQrCode(data: string): Promise<string> {
        try {
            return await qrcode.toDataURL(data)
        } catch (error) {
            throw new Error(`Failed to generate qr-code. Reason: ${error.message}`)
        }
    }
    
    async getListObjects() {
        return this.s3.listObjects({ Bucket: process.env.S3_BUCKET })
    }

    async uploadObject(file: Express.Multer.File, fileName: string): Promise<string> {
        let key = fileName ?? generateUniqueId({ length: 8 })

        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: file.mimetype,
            ACL: 'public-read-write'
        }

        try {
            const response: PutObjectCommandOutput = 
                await this.s3.send(new PutObjectCommand(input))

            if (response.$metadata.httpStatusCode === 200) {
                // return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`
                return key
            }
            throw new Error('Image not saved in s3!')
        }
        catch (err) {
            throw err
        }
    }
}
