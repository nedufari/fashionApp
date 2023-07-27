import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { AdminEntityRepository, CustomerEntityRepository, VendorEntityRepository } from "../../auth/auth.repository";
import { ICustomerResponse } from "../customers/customers.interface";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { IVendorResponse } from "../vendor/vendor.interface";

@Injectable()
export class AdminService{
    constructor(@InjectRepository(CustomerEntity)private customerrepository:CustomerEntityRepository,
    @InjectRepository(AdminEntity)private adminrepository:AdminEntityRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,){}

    //get all customers
    async AdminGetAllCustomers():Promise<ICustomerResponse[]>{
        try {
             //verify admin 
        // const admin = this.adminrepository.findOne({where:{id:id}})
        // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
        const customers= await this.customerrepository.find()

        const customerResponses: ICustomerResponse[] = customers.map((customer) => ({
            digital_photo: customer.digital_photo,
            username: customer.username,
            gender: customer.gender,
            fullname: customer.fullname,
            CustomerID: customer.CustomerID,
            comments: customer.comments,
            replies: customer.replies,
          }));

          return customerResponses 
            
        } catch (error) {
            throw error
            
        }
       

    }

        //get one customers
        async AdminGetOneCustomer(customerid:string):Promise<ICustomerResponse>{
            try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const customer= await this.customerrepository.findOne({where:{CustomerID:customerid}})
            if (!customer) throw new HttpException(`customer with ${customerid} not found`,HttpStatus.NOT_FOUND)
    
            const customerResponses: ICustomerResponse={
                digital_photo: customer.digital_photo,
                username: customer.username,
                gender: customer.gender,
                fullname: customer.fullname,
                CustomerID: customer.CustomerID,
                comments: customer.comments,
                replies: customer.replies,
            };
    
              return customerResponses 
                
            } catch (error) {
                
            }
            
    
        }


           //get all vendor
    async AdminGetAllVendorss():Promise<IVendorResponse[]>{
        try {
             //verify admin 
        // const admin = this.adminrepository.findOne({where:{id:id}})
        // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
        const vendors= await this.vendorrepository.find()

        const vendorResponses: IVendorResponse[] = vendors.map((vendor) => ({
            display_photo: vendor.display_photo,
            gender: vendor.gender,
            VendorID: vendor.VendorID,
            phone1:vendor.phone1,
            phone2:vendor.phone2,
            bio:vendor.bio,
            facebook:vendor.facebook,
            twitter:vendor.twitter,
            thread:vendor.thread,
            instagram:vendor.instagram,
            tiktok:vendor.tiktok,
            snapchat:vendor.snapchat,
            brandname:vendor.brandname,
            address:vendor.address
            
          }));

          return vendorResponses 
            
        } catch (error) {
            throw error
            
        }
       

    }

        //get one vendor
        async AdminGetOneVendor(vendorid:string):Promise<IVendorResponse>{
            try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const vendor= await this.vendorrepository.findOne({where:{VendorID:vendorid}})
            if (!vendor) throw new HttpException(`customer with ${vendorid} not found`,HttpStatus.NOT_FOUND)
    
            const vendorResponses: IVendorResponse={
                display_photo: vendor.display_photo,
                gender: vendor.gender,
                VendorID: vendor.VendorID,
                phone1:vendor.phone1,
                phone2:vendor.phone2,
                bio:vendor.bio,
                facebook:vendor.facebook,
                twitter:vendor.twitter,
                thread:vendor.thread,
                instagram:vendor.instagram,
                tiktok:vendor.tiktok,
                snapchat:vendor.snapchat,
                brandname:vendor.brandname,
                address:vendor.address
            };
    
              return vendorResponses 
                
            } catch (error) {
                
            }
            
    
        }
}