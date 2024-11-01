import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { QrcodeModule } from './qrcode/qrcode.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
      ConfigModule.forRoot(),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public')
      }),
      QrcodeModule,
      AuthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
