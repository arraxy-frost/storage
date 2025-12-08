import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import multipart from '@fastify/multipart';
import { ConsoleLogger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
    const PORT = process.env.PORT || 3000;

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: new ConsoleLogger({
                prefix: 'Storage',
            }),
        },
    );

    app.setGlobalPrefix('api/storage');

    await app.register(multipart);

    await app.listen(PORT);
    console.log('Server is running on port ' + PORT);
}
bootstrap();
