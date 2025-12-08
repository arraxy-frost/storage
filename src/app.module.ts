import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { StorageModule } from './modules/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './shared/prisma.service';
import s3Config from './config/s3.config';

@Module({
    imports: [
        FilesModule,
        StorageModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [s3Config],
        }),
    ],
    providers: [PrismaService],
})
export class AppModule {}
