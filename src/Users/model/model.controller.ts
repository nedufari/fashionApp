import { Controller, Get, Param,Post } from "@nestjs/common"
import { ModelService } from "./model.service";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";

@Controller('model')
export class ModelController{
    constructor(private readonly modelservice:ModelService){}

    @Get('myoffers/:model')
    async findmyoffers(@Param('model')model:string):Promise<ContractsOfffer[]>{
        return await this.modelservice.getMyoffers(model)
    }

    @Get('mycounteroffers/:model')
    async findmyCounteroffers(@Param('model')model:string):Promise<CounterContractsOfffer[]>{
        return await this.modelservice.getMyCounteroffers(model)
    }

    @Post('lines/:vendor')
  async addlines(@Param('vendor')vendor:string,dto:AddLinesDto){
      return await this.modelservice.nitch(vendor,dto)
  }
}
