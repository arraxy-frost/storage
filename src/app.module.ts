import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'
import { ImageModule } from './image/image.module'

@Module({
    imports: [
      ConfigModule.forRoot(),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public')
      }),
      AuthModule,
      ImageModule,
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
      })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
