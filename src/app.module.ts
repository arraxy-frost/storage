import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { QrcodeModule } from './qrcode/qrcode.module';

@Module({
    imports: [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public')
      }),
      QrcodeModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
