import { Module } from '@nestjs/common';
import { S3StorageModule } from './s3-storage/s3-storage.module';

@Module({
  imports: [S3StorageModule]
})
export class FilesModule {}
