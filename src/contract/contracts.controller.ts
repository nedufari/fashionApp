import { Body, Controller, Get, Param, Post,Put } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { AcceptContractofferDto, ContractDto, CounterOfferDto, ExtendContractDto } from "./cotracts.dto";
import {  IContractModelResponse, IContractPhotographerResponse } from "../Entity/contracts.entity";

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
    async ContractBetweenVendorAndModel(@Param('vendorid')vendorid:string, @Param('modelid')modelid:string, @Body()contractdto:ContractDto):Promise<IContractModelResponse>{
        try {
            const contract =await this.contractservice.ContractBtwnModelandVendor(vendorid,modelid,contractdto)
            return contract
            
        } catch (error) {
            throw error      
        }
        
    }

    //contract entension 
    @Post('extend/contract/vendor&model/:contractid/:vendorid/:modelid')
    async ContractExtensionfromVendorToModel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()extenddto:ExtendContractDto){
        try {
            const contract =await this.contractservice.ContractExtensionfromVendorToModel(extenddto,contractID,vendorid,modelid)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }

    //accept offer from 
    @Post('accept/contract/vendor&model/:contractid/:vendorid/:modelid')
    async AcceptContractExtensionfrombymodel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer?:CounterOfferDto):Promise<IContractModelResponse>{
        try {
            const contract =await this.contractservice.AcceptOfferFromVendorByModel(contractID,vendorid,modelid,acceptofferdto,counteroffer)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }

       //accept counter offer offer from model
       @Put('accept/contract/counter/vendor&model/:contractid/:vendorid/:modelid')
       async AcceptContractExtensionCounterfrombymodel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer?:CounterOfferDto):Promise<IContractModelResponse>{
           try {
               const contract =await this.contractservice.AcceptCounterofferFromModelToVendor(contractID,vendorid,modelid,acceptofferdto,counteroffer)
               return contract
               
           } catch (error) {
               throw error
               
           }
           
       }

    
    


}