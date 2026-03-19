import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    bucket: process.env.S3_BUCKET,
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    secretAccessKey: process.env.S3_SECRET,
}));
