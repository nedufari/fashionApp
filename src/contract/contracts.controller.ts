import { Body, Controller, Get, HttpException, HttpStatus, Param, Post,Put } from "@nestjs/common";
import { ContractModelService } from "./contract.models.service";
import { AcceptContractofferDto, ContractDto, CounterOfferDto, ExtendContractDto } from "./cotracts.dto";
import {  IContractModelResponse, IContractPhotographerResponse } from "../Entity/contracts.entity";
// import { ContractPhotographerService } from "./contract.photographer.service";
import { IContractOfferModelResponse } from "../Entity/contractoffer.entity";
import { IcounterContractOfferModelResponse } from "../Entity/countercontractOffer.entity";

@Controller('contract')
export class ContractController{
    constructor(private readonly modelcontractservice:ContractModelService){}

    // @Post('vendor&photo/:vendorid/:photographerid')
    // async ContractBetweenVendorAndPhotographer(@Param('vendorid')vendorid:string, @Param('photographerid')photographerid:string, @Body()contractdto:ContractDto):Promise<IContractPhotographerResponse>{
    //     try {
    //         const contract =await this.photocontractservice.ContractBtwnPhotographerandVendor(vendorid,photographerid,contractdto)
    //         return contract
            
    //     } catch (error) {
    //         throw error
            
    //     }
        
    // }


    @Post('vendormodel/:vendorid/:modelid')
    async ContractOfferBetweenVendorAndModel(@Param('vendorid')vendorid:string, @Param('modelid')modelid:string, @Body()contractdto:ContractDto):Promise<IContractOfferModelResponse>{
        try {
            const contract =await this.modelcontractservice.sendcontractoffer(vendorid,modelid,contractdto)
            return contract
            
        } catch (error) {
            throw error      
        }
        
    }


    //contract entension 
    // @Post('extend/contract/vendor&model/:contractid/:vendorid/:modelid')
    // async ContractExtensionfromVendorToModel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()extenddto:ExtendContractDto){
    //     try {
    //         const contract =await this.modelcontractservice.ContractExtensionfromVendorToModel(extenddto,contractID,vendorid,modelid)
    //         return contract
            
    //     } catch (error) {
    //         throw error
            
    //     }
        
    // }

    //accept offer from 
    @Post('acceptdeclinecounter/:vendorid/:modelid/:coi')
    async AcceptContractExtensionfrombymodel(@Param('vendorid')vendorid:string,@Param('modelid')modelid:string,@Param('coi')coi:string,  @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer:CounterOfferDto): Promise<IContractModelResponse | IcounterContractOfferModelResponse>{
        try {
            if (acceptofferdto){
            const contract = await this.modelcontractservice.AcceptContractOfferORDeclineOrSendCounterOffer(vendorid,modelid,coi,acceptofferdto)
            return contract
            }
            else if (counteroffer){
                const counter = await this.modelcontractservice.AcceptContractOfferORDeclineOrSendCounterOffer(vendorid,modelid,coi,acceptofferdto,counteroffer)
                return counter
            }
            else {
                throw new HttpException('sorry i can accept this offer',HttpStatus.OK)
            }
            
        } catch (error) {
            throw error
            
        }
        
    }

       //accept counter offer offer from model
    //    @Put('accept/contract/counter/vendor&model/:contractid/:vendorid/:modelid')
    //    async AcceptContractExtensionCounterfrombymodel(@Param('contractid')contractID:string, @Param('modelid')modelid:string,@Param('vendorid')vendorid:string, @Body()acceptofferdto:AcceptContractofferDto,@Body()counteroffer?:CounterOfferDto):Promise<IContractModelResponse>{
    //        try {
    //            const contract =await this.modelcontractservice.AcceptCounterofferFromModelToVendor(contractID,vendorid,modelid,acceptofferdto,counteroffer)
    //            return contract
               
    //        } catch (error) {
    //            throw error
               
    //        }
           
    //    }

    
    


}