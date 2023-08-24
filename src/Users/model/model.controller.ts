import { Body, Controller, Get, Param,Patch,Post } from "@nestjs/common"
import { ModelService } from "./model.service";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { AddLinesDto } from "../vendor/vendor.dto";
import { IVendorPostResponse } from "../../Entity/Posts/vendor.post.entity";
import { AddInterestsDto, ModelPortfolioDto } from "./model.dto";
import { IModelResponse } from "./model.interface";

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

    @Post('Interests/:vendor')
  async addlines(@Param('vendor')vendor:string,@Body()dto:AddInterestsDto){
      return await this.modelservice.AddInterests(vendor,dto)
  }

@Get('vendorposts')
async GetallvendorPosts(): Promise<IVendorPostResponse[]>{
    return await this.modelservice.getAllPosts()
}

@Patch('portfolio/:modelid')
async ModelPortfolio(@Body()dto:ModelPortfolioDto,@Param('modelid')modelid:string):Promise<IModelResponse>{
    return await this.modelservice.createPortfolio(modelid,dto)
}
}
