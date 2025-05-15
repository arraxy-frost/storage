import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { VersioningType } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const PORT = process.env.PORT ?? 3000

    app.enableCors();

    app.setGlobalPrefix('api');

    app.enableVersioning({
        type: VersioningType.URI
    });

    const config = new DocumentBuilder()
        .setTitle('Photo Storage')
        .setDescription('Storage api description')
        .setVersion('1.0')
        .addTag('storage')
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(PORT)
    console.log('Listening port', PORT)
}
bootstrap()
