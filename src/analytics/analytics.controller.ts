import { Controller, Get, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RealIP } from 'nestjs-real-ip';
import { Response } from 'express';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get() 
    async getRawData(
        @Query('eventId') eventId: string, 
        @Query('dateStart') dateStart: string,
        @Query('dateEnd') dateEnd: string,
        @Query('sender') sender: string,
        @Query('payload') payload: string,
    ) {
        if (!dateStart || !dateEnd) {
            throw new HttpException('dateStart and dateEnd are required', HttpStatus.BAD_REQUEST);
        } else {
            return await this.analyticsService.getData(eventId, dateStart, dateEnd, sender, payload)
        }
    }

    @Get('/daily')
    async getDailyReport(@Query('date') date: string) {
        return await this.analyticsService.getDailyReport(date)
    }
}
