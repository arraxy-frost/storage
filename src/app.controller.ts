import { Controller, Get, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { RealIP } from 'nestjs-real-ip'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get('my-ip')
    async getIp(@RealIP() ip: string) {
        return ip
    }
}
