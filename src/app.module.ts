import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'
import { ImageModule } from './image/image.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnalyticsModule } from './analytics/analytics.module';
import { Event } from './analytics/entity/event.entity'

@Module({
    imports: [
      ConfigModule.forRoot(),
      AuthModule,
      ImageModule,
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Event],
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
      AnalyticsModule
    ],
})
export class AppModule {}
