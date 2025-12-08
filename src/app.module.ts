import { Module } from '@nestjs/common';
import { FilesModule } from './modules/files/files.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
    imports: [FilesModule, StorageModule]
})
export class AppModule {}
