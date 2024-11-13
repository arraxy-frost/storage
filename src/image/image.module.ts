import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { Event } from 'src/analytics/entity/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        AnalyticsModule,
        TypeOrmModule.forFeature([Event])
    ],
    providers: [ImageService, AnalyticsService],
    controllers: [ImageController]
})
export class ImageModule {}
