import { Body, Controller, Get, HttpException, HttpStatus, Param, Post,Put } from "@nestjs/common";
import { ContractModelService } from "./contract.models.service";
import { AcceptContractofferDto, ContractDto, CounterOfferDto, ExtendContractDto } from "./cotracts.dto";
import {  IContractModelResponse, IContractPhotographerResponse } from "../Entity/contracts.entity";
// import { ContractPhotographerService } from "./contract.photographer.service";
import { IContractOfferModelResponse, IContractOfferPhotographerResponse } from "../Entity/contractoffer.entity";
import { ICounterContractOfferPhotographerResponse, IcounterContractOfferModelResponse } from "../Entity/countercontractOffer.entity";
import { ContractPhotographerService } from "./contract.photographer.service";

@Controller('contract')
export class ContractController{
    constructor(private readonly modelcontractservice:ContractModelService,
        private readonly photographercontractservice:ContractPhotographerService){}




    @Post('vendormodel/:vendorid/:modelid')
    async ContractOfferBetweenVendorAndModel(@Param('vendorid')vendorid:string, @Param('modelid')modelid:string, @Body()contractdto:ContractDto):Promise<IContractOfferModelResponse>{
        try {
            const contract =await this.modelcontractservice.sendcontractoffer(vendorid,modelid,contractdto)
            return contract
            
        } catch (error) {
            throw error      
        }
        
    }



    //accept offer from 
    @Post('acceptdecline/:vendorid/:modelid/:coi')
    async AcceptContractoffer(@Param('vendorid')vendorid:string,@Param('modelid')modelid:string,@Param('coi')coi:string,  @Body()acceptofferdto:AcceptContractofferDto,): Promise<IContractModelResponse>{
        try {
            
            const contract = await this.modelcontractservice.AcceptContractOfferORDecline(vendorid,modelid,coi,acceptofferdto)
            return contract
            
            
        } catch (error) {
            throw error
            
        }
        
    }

    @Post('counter/:vendorid/:modelid/:coi')
    async CounterOffer(@Param('vendorid')vendorid:string,@Param('modelid')modelid:string,@Param('coi')coi:string,  @Body()counterdto:CounterOfferDto,): Promise<IcounterContractOfferModelResponse>{
        try {
            
            const contract = await this.modelcontractservice.countercontrctOffer(vendorid,modelid,coi,counterdto)
            return contract
            
            
        } catch (error) {
            throw error
            
        }
        
    }

        //accept offer from 
        @Post('acceptdeclinecounteroffer/:vendorid/:modelid/:coi')
        async AcceptCounterOffer(@Param('vendorid')vendorid:string,@Param('modelid')modelid:string,@Param('coi')coi:string,  @Body()acceptofferdto:AcceptContractofferDto,): Promise<IContractModelResponse>{
            try {
                
                const contract = await this.modelcontractservice.AcceptCounterContractOfferORDecline(vendorid,modelid,coi,acceptofferdto)
                return contract
                
                
            } catch (error) {
                throw error
                
            }
            
        }


        //photographer


 


        
    @Post('vendorphoto/:vendorid/:photoid')
    async ContractOfferBetweenVendorAndPhotographer(@Param('vendorid')vendorid:string, @Param('photoid')photoid:string, @Body()contractdto:ContractDto):Promise<IContractOfferPhotographerResponse>{
        try {
            const contract =await this.photographercontractservice.sendcontractoffer(vendorid,photoid,contractdto)
            return contract
            
        } catch (error) {
            throw error      
        }
        
    }



    //accept offer from 
    @Post('acceptdeclinephoto/:vendorid/:photoid/:coi')
    async AcceptContractofferphotgrapher(@Param('vendorid')vendorid:string,@Param('photoid')photoid:string,@Param('coi')coi:string,  @Body()acceptofferdto:AcceptContractofferDto,): Promise<IContractPhotographerResponse>{
        try {
            
            const contract = await this.photographercontractservice.AcceptContractOfferORDecline(vendorid,photoid,coi,acceptofferdto)
            return contract
            
            
        } catch (error) {
            throw error
            
        }
        
    }

    @Post('counterphoto/:vendorid/:photoid/:coi')
    async CounterOfferPhotogrpher(@Param('vendorid')vendorid:string,@Param('photoid')photoid:string,@Param('coi')coi:string,  @Body()counterdto:CounterOfferDto,): Promise<ICounterContractOfferPhotographerResponse>{
        try {
            
            const contract = await this.photographercontractservice.countercontrctOffer(vendorid,photoid,coi,counterdto)
            return contract
            
            
        } catch (error) {
            throw error
            
        }
        
    }

        //accept offer from 
        @Post('acceptdeclinecounterofferphoto/:vendorid/:photoid/:coi')
        async AcceptCounterOfferPhotographer(@Param('vendorid')vendorid:string,@Param('photoid')photoid:string,@Param('coi')coi:string,  @Body()acceptofferdto:AcceptContractofferDto,): Promise<IContractPhotographerResponse>{
            try {
                
                const contract = await this.photographercontractservice.AcceptCounterContractOfferORDecline(vendorid,photoid,coi,acceptofferdto)
                return contract
                
                
            } catch (error) {
                throw error
                
            }
            
        }
    
    


}