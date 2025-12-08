import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        console.log(process.env.DATABASE_URL);
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter });
    }
}