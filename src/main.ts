import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { Logger, VersioningType } from '@nestjs/common'

async function bootstrap() {
    const logger = new Logger('Application');
    const app = await NestFactory.create(AppModule)
    const PORT = process.env.PORT ?? 3000

    app.enableCors();

    app.setGlobalPrefix('storage/api');

    app.enableVersioning({
        type: VersioningType.URI
    });

    const config = new DocumentBuilder()
        .setTitle('Storage API')
        .setDescription('Storage api description')
        .setVersion('1.0.0')
        .addApiKey({
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }, 'api-key')
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('storage/swagger', app, documentFactory)

    await app.listen(PORT)
    logger.log(`Server started on ${PORT}`);
}

bootstrap();
