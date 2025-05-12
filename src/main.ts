import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const PORT = process.env.PORT ?? 3000;
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Photo Storage')
        .setDescription('Storage api description')
        .setVersion('1.0')
        .addTag('storage')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);


    await app.listen(PORT);
    console.log('Listening port', PORT);
}
bootstrap()
