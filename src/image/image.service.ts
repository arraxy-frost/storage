import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import * as qrcode from 'qrcode';
// import * as S3 from 's3-client'


@Injectable()
export class ImageService {
    // private s3Client: any;
    constructor(@InjectS3() private readonly s3: S3,) {
        // this.s3Client = S3.createClient({
        //     maxAsyncS3: 20,     // this is the default
        //     s3RetryCount: 3,    // this is the default
        //     s3RetryDelay: 1000, // this is the default
        //     multipartUploadThreshold: 20971520, // this is the default (20 MB)
        //     multipartUploadSize: 15728640, // this is the default (15 MB)
        //     s3Options: {
        //         accessKeyId: process.env.S3_ACCESS_KEY_ID,
        //         secretAccessKey: process.env.S3_SECRET,
        //         region: process.env.S3_REGION,
        //         endpoint: process.env.S3_ENDPOINT,
        //         sslEnabled: true
        //       // any other options are passed to new AWS.S3()
        //       // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        //     },
        // })
    }

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

    // async getListObjects() {
    //     this.s3Client.listObjects({
    //         recursive: false,
    //         s3Params: {
    //             Bucket: process.env.S3_BUCKET
    //         }
    //     }, (err, data) => {
    //         console.log(data)
    //     }).on('data', (data) => { 
    //         console.log(data)
    //     })

    //     return new Promise((resolve, reject) => {
    //         this.s3Client.listObjects({
    //             recursive: false,
    //             s3Params: {
    //                 Bucket: process.env.S3_BUCKET
    //             }
    //         }, (err, data) => {
    //             if (err) {
    //                 console.log(err)
    //                 reject(err)
    //             } else {
    //                 console.log(err)
    //                 resolve(data)
    //             }
    //         })
    //     })
    // }
}
