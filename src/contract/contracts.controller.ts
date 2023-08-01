import { Body, Controller, Get, Param, Post,Put } from "@nestjs/common";
import { ContractModelService } from "./contract.models.service";
import { AcceptContractofferDto, ContractDto, CounterOfferDto, ExtendContractDto } from "./cotracts.dto";
import {  IContractModelResponse, IContractPhotographerResponse } from "../Entity/contracts.entity";
import { ContractPhotographerService } from "./contract.photographer.service";

@Controller('contract')
export class ContractController{
    constructor(private readonly modelcontractservice:ContractModelService,private readonly photocontractservice:ContractPhotographerService){}

    @Post('vendor&photo/:vendorid/:photographerid')
    async ContractBetweenVendorAndPhotographer(@Param('vendorid')vendorid:string, @Param('photographerid')photographerid:string, @Body()contractdto:ContractDto):Promise<IContractPhotographerResponse>{
        try {
            const contract =await this.photocontractservice.ContractBtwnPhotographerandVendor(vendorid,photographerid,contractdto)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }


    @Post('vendormodel/:vendorid/:modelid')
    async ContractBetweenVendorAndModel(@Param('vendorid')vendorid:string, @Param('modelid')modelid:string, @Body()contractdto:ContractDto):Promise<IContractModelResponse>{
        try {
            const contract =await this.modelcontractservice.ContractBtwnModelandVendor(vendorid,modelid,contractdto)
            return contract
            
        } catch (error) {
            throw error      
        }
        
    }

    //psc3KmRI omalicha cuts vendor 
// //GZnf33N0 for kudz model 
//ee22IZnU dotun captures a photographer
//3kjvrb2esg contract validity number 

    //contract entension 
    @Post('extend/contract/vendor&model/:contractid/:vendorid/:modelid')
    async ContractExtensionfromVendorToModel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()extenddto:ExtendContractDto){
        try {
            const contract =await this.modelcontractservice.ContractExtensionfromVendorToModel(extenddto,contractID,vendorid,modelid)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }

    //accept offer from 
    @Post('accept/contract/vendor&model/:contractid/:vendorid/:modelid')
    async AcceptContractExtensionfrombymodel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer?:CounterOfferDto):Promise<IContractModelResponse>{
        try {
            const contract =await this.modelcontractservice.AcceptOfferFromVendorByModel(contractID,vendorid,modelid,acceptofferdto,counteroffer)
            return contract
            
        } catch (error) {
            throw error
            
        }
        
    }

       //accept counter offer offer from model
       @Put('accept/contract/counter/vendor&model/:contractid/:vendorid/:modelid')
       async AcceptContractExtensionCounterfrombymodel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer?:CounterOfferDto):Promise<IContractModelResponse>{
           try {
               const contract =await this.modelcontractservice.AcceptCounterofferFromModelToVendor(contractID,vendorid,modelid,acceptofferdto,counteroffer)
               return contract
               
           } catch (error) {
               throw error
               
           }
           
       }

    
    


}