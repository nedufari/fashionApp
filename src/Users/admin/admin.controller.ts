import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ICustomer, ICustomerResponse } from "../customers/customers.interface";
import { IVendorResponse } from "../vendor/vendor.interface";
import { IPhotographer } from "../photographers/photo.interface";
import { IModel } from "../model/model.interface";
import { INotification } from "../../Entity/Notification/notification.entity";
import { IContract } from "../../Entity/contracts.entity";
import { VerifyAccountDto } from "./admin.dto";
import { IContractOffer } from "../../Entity/contractoffer.entity";
import { IWallet, IWalletResponse } from "../../Entity/wallet/wallet.entity";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminservice:AdminService){}

    //get all customer
    @Get('/customers')
    async AdminGetAllCustomer():Promise<ICustomer[]>{
        try {
            const customers= await this.adminservice.AdminGetAllCustomers()
        return customers
            
        } catch (error) {
            throw error     
        }
    }


      //get all customer
      @Get('/onecustomer/:customerid')
      async AdminGetOneCustomer(@Param('customerid')customerid:string):Promise<ICustomerResponse>{
        try {
            const customer= await this.adminservice.AdminGetOneCustomer(customerid)
            return customer
            
        } catch (error) {
            throw error 
        }
          
      }

       //get all customer
    @Get('/vendors')
    async AdminGetAllVendors():Promise<IVendorResponse[]>{
        try {
            const vendors= await this.adminservice.AdminGetAllVendorss()
        return vendors
            
        } catch (error) {
            throw error     
        }
    }


      //get one vendor
      @Get('/onevendor/:vendorid')
      async AdminGetOneVendor(@Param('vendorid')vendorid:string):Promise<IVendorResponse>{
        try {
            const vendor= await this.adminservice.AdminGetOneVendor(vendorid)
            return vendor
            
        } catch (error) {
            throw error 
        }
      }

      //get all photographer 
      @Get('/photographers')
      async AdminGetAllPhotographers():Promise<IPhotographer[]>{
        try {
            const photgraphers= await this.adminservice.AdminGetAllPhotographers()
            return photgraphers
        } catch (error) {
            
        }
      }

      @Get('/photographers/:photoid')
      async AdminGetOnePhotographers(@Param('photoid')photoid:string):Promise<IPhotographer>{
        try {
            const photgrapher= await this.adminservice.AdminGetOnePhotographer(photoid)
            return photgrapher
        } catch (error) {
            
        }
      }

           //get all models
           @Get('/models')
           async AdminGetAllModels():Promise<IModel[]>{
             try {
                 const models= await this.adminservice.AdminGetAllModels()
                 return models
             } catch (error) {
                 
             }
           }
     
           @Get('/models/:modelid')
           async AdminGetOneModel(@Param('modelid')modelid:string):Promise<IModel>{
             try {
                 const photgrapher= await this.adminservice.AdminGetOneModel(modelid)
                 return photgrapher
             } catch (error) {
                 
             }
           }


           @Get('/notifications')
           async AdminGetAllNotifications():Promise<INotification[]>{
             try {
                 const models= await this.adminservice.AdminGetAllNotifications()
                 return models
             } catch (error) {
                 
             }
           }

           @Get('/contracts')
           async AdminGetAllContracts():Promise<IContract[]>{
             try {
                 const models= await this.adminservice.AdminGetAllContrats()
                 return models
             } catch (error) {
                 
             }
           }

           @Get('/wallets')
           async AdminGetAllWallets():Promise<IWalletResponse[]>{
             try {
                 const wallets= await this.adminservice.AdminGetAllWallets()
                 return wallets
             } catch (error) {
                 
             }
           }

           @Get('/contractsoffer')
           async AdminGetAllContractsOffer():Promise<IContractOffer[]>{
             try {
                 const models= await this.adminservice.AdminGetAllContratsOfffer()
                 return models
             } catch (error) {
                 
             }
           }

          @Delete('delete/vendor/:vendorid')
          async deletevendor(@Param('vendorid')vendorid:string):Promise<{message:string}>{
            return await this.adminservice.deleteVendor(vendorid)
          }

          @Delete('delete/model/:modelid')
          async deleteModel(@Param('modelid')modelid:string):Promise<{message:string}>{
            return await this.adminservice.deleteModel(modelid)
          }

          @Delete('delete/photographer/:photoid')
          async deletePhotographer(@Param('photoid')photoid:string):Promise<{message:string}>{
            return await this.adminservice.deletePhotogrpher(photoid)
          }

          @Delete('delete/customer/:customerid')
          async deleteCustomer(@Param('customerid')customerid:string):Promise<{message:string}>{
            return await this.adminservice.deleteCustomer(customerid)
          }

          

          //verify accounts 

          @Patch('verify/model/:modelid')
          async VerifyModelAccount(@Body()dto:VerifyAccountDto,@Param('modelid')modelid:string):Promise<{message:string}>{
            return await this.adminservice.VerifyModelAccount(dto,modelid)
            
          }

          @Patch('verify/vendor/:modelid')
          async VerifyVendorAccount(@Body()dto:VerifyAccountDto,@Param('modelid')modelid:string):Promise<{message:string}>{
            return await this.adminservice.VerifyVendorAccount(dto,modelid)
            
          }

          @Patch('verify/pgotographer/:modelid')
          async VerifyPhotographerAccount(@Body()dto:VerifyAccountDto,@Param('modelid')modelid:string):Promise<{message:string}>{
            return await this.adminservice.VerifyPhotographerAccount(dto,modelid)
            
          }

          @Patch('verify/customer/:modelid')
          async VerifyCustomerAccount(@Body()dto:VerifyAccountDto,@Param('modelid')modelid:string):Promise<{message:string}>{
            return await this.adminservice.VerifyCustomerAccount(dto,modelid)
            
          }
}

