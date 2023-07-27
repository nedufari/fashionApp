import { Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { ICustomerResponse } from "../customers/customers.interface";
import { IVendorResponse } from "../vendor/vendor.interface";

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
    @Get('/allvendors')
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
}