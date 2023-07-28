import { Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ICustomerResponse } from "../customers/customers.interface";
import { IVendorResponse } from "../vendor/vendor.interface";
import { IPhotographer } from "../photographers/photo.interface";
import { IModel } from "../model/model.interface";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminservice:AdminService){}

    //get all customer
    @Get('/allcustomers')
    async AdminGetAllCustomer():Promise<ICustomerResponse[]>{
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
      @Get('/onecustomer/:vendorid')
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
}
//ETYUv_HA photo
// psc3KmRI vendor