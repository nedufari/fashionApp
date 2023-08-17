import { Controller, Get, Param } from "@nestjs/common"
import { ModelService } from "./model.service";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";

@Controller('model')
export class ModelController{
    constructor(private readonly modelservice:ModelService){}

    @Get('myoffers/:model')
    async findmyoffers(@Param('model')model:string):Promise<ContractsOfffer[]>{
        return await this.modelservice.getMyoffers(model)
    }
}
