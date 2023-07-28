import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ContractDto } from "./cotracts.dto";
import {  IContractPhotographerResponse } from "../Entity/contracts.entity";

@Controller('contract')
export class ContractController{
    constructor(private readonly contractservice:ContractService){}

    @Post('vendor&photo/:vendorid/:photographerid')
    async ContractBetweenVendorAndPhotographer(@Param('vendorid')vendorid:string, @Param('photographerid')photographerid:string, @Body()contractdto:ContractDto):Promise<IContractPhotographerResponse>{
        try {
            const contract =await this.contractservice.ContractBtwnPhotographerandVendor(vendorid,photographerid,contractdto)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }


    @Post('vendor&model/:vendorid/:modelid')
    async ContractBetweenVendorAndModel(@Param('vendorid')vendorid:string, @Param('modelid')modelid:string, @Body()contractdto:ContractDto):Promise<IContractPhotographerResponse>{
        try {
            const contract =await this.contractservice.ContractBtwnPhotographerandVendor(vendorid,modelid,contractdto)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }
}