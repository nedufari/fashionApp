import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";


@Controller('user')
export class AppController{
    constructor(private userservice:AppService){}

    @Get('/welcome')
    async welcome():Promise<string>{
        return await this.userservice.welcome()
    }

}
  