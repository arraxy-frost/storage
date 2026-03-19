import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        const adapter = new PrismaMariaDb({
            host: config.getOrThrow('DB_HOST'),
            user: config.getOrThrow('DB_USER'),
            password: config.getOrThrow('DB_PASS'),
            database: config.getOrThrow('DB_NAME'),
            connectionLimit: 5
        });
        super({ adapter });

    }
}
