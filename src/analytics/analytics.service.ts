import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Event)
        private analyticsEventRepository: Repository<Event>
    ) {}

    async create(eventId: string, payload: string, sender: string): Promise<Event | null> {
        const analyticsEvent = new Event()

        analyticsEvent.eventId = eventId
        analyticsEvent.payload = payload
        analyticsEvent.sender = sender

        return this.analyticsEventRepository.save(analyticsEvent)
    }

    async getData(eventId: string, dateStart: string, dateEnd: string, sender: string, payload: string) {
        let searchDateStart = new Date(Date.parse(dateStart))
        let searchDateEnd = new Date(Date.parse(dateEnd))
        // Add 1 day for correct searching
        searchDateEnd.setDate(searchDateEnd.getDate() + 1)     
        
        return this.analyticsEventRepository.find({
            where: [{
                eventId: eventId ? eventId : null,
                sender: sender ? sender : null,
                payload: payload ? payload : null,
                createdAt: Between(searchDateStart, searchDateEnd)
                // dateStart && date ? MoreThanOrEqual(new Date(Date.parse(dateStart))) : null,
            }]
        })
    }

    async getDailyReport(date: string) {
        let rawData = await this.getData(null, date, date, null, null)

        // We are goung to calculate this:
        // 1. saveImage count
        // 2. getImage count
        // 3. hour by hour counts (total 24 hour)

        let result = {
            countSavePhoto: 0,
            countGetPhoto: 0,
            hourStatSavePhoto: this.initializeArrayWithValues(24, 0),
            hourStatGetPhoto: this.initializeArrayWithValues(24, 0)
        }

        rawData.forEach((item) => {
            if (item.eventId == 'savePhoto') {
                result.countSavePhoto++
                result.hourStatSavePhoto[item.createdAt.getHours()]++
            }
            if (item.eventId == 'getPhoto') {
                result.countGetPhoto++
                result.hourStatGetPhoto[item.createdAt.getHours()]++
            }
        })

        return result
    }

    private initializeArrayWithValues = (n, val = 0) => Array(n).fill(val)
}
