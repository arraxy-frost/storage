import { Module } from '@nestjs/common';
import { S3StorageService } from './s3-storage.service';
import { S3StorageController } from './s3-storage.controller';

@Module({
  providers: [S3StorageService],
  controllers: [S3StorageController]
})
export class S3StorageModule {}
