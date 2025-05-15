import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from './files/files.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
      ConfigModule.forRoot(),
      AuthModule,
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [],
        synchronize: true,
      }),
      S3Module.forRoot({
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET
          },
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION,
          forcePathStyle: true,
        }
      }),
      FilesModule,
      QrcodeModule,
    ],
})
export class AppModule {}
