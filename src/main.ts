import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    app.setGlobalPrefix('api/storage');

    const PORT = process.env.PORT || 3000;

    await app.listen(PORT);
    console.log('Server is running on port ' + PORT);
}
bootstrap();
