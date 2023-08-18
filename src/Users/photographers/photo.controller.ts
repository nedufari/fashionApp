import { Controller, Get, Param } from "@nestjs/common"

import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerService } from "./photo.service";

@Controller('photographer')
export class PhotographerController{
    constructor(private readonly photoservice:PhotographerService){}

    @Get('myoffers/:photo')
    async findmyoffers(@Param('photo')photo:string):Promise<ContractsOfffer[]>{
        return await this.photoservice.getMyoffers(photo)
    }

    @Get('mycounteroffers/:photo')
    async findmyCounteroffers(@Param('photo')photo:string):Promise<CounterContractsOfffer[]>{
        return await this.photoservice.getMyCounteroffers(photo)
    }
}
