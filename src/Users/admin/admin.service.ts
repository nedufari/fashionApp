import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { AdminEntityRepository, CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository } from "../../auth/auth.repository";
import { ICustomer, ICustomerResponse } from "../customers/customers.interface";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { IVendorResponse } from "../vendor/vendor.interface";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { UserOtp } from "../../Entity/userotp.entity";
import { Contracts, IContract } from "../../Entity/contracts.entity";
import { ContractOfferRepository, ContractRepository } from "../../contract/contrct.repository";
import { IPhotographer } from "../photographers/photo.interface";
import { IModel } from "../model/model.interface";
import { INotification, Notifications } from "../../Entity/Notification/notification.entity";
import { NotificationType } from "../../Enums/notificationTypes.enum";
import { VerifyAccountDto } from "./admin.dto";
import { ContractsOfffer, IContractOffer } from "../../Entity/contractoffer.entity";

@Injectable()
export class AdminService{
    constructor(@InjectRepository(CustomerEntity)private customerrepository:CustomerEntityRepository,
    @InjectRepository(AdminEntity)private adminrepository:AdminEntityRepository,
    @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photorepository:PhotographerEntityRepository,
    @InjectRepository(ModelEntity)private modelrepository:ModelEntityRepository,
    @InjectRepository(UserOtp)private otprepository:OtpRepository,
    @InjectRepository(Contracts)private contractsrepository:ContractRepository,
    @InjectRepository(ContractsOfffer)private contractoffersrepository:ContractOfferRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,){}

    //get all customers
    async AdminGetAllCustomers():Promise<ICustomer[]>{
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

          return customers 
            
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

          return vendors
            
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

    //for photographers 
    async AdminGetAllPhotographers():Promise<IPhotographer[]>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const photographers= await this.photorepository.find()
            return photographers
        } catch (error) {
            throw error
            
        }
        
    }

    async AdminGetOnePhotographer(photoid:string):Promise<IPhotographer>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const photographer= await this.photorepository.findOne({where:{PhotographerID:photoid}})
            return photographer
        } catch (error) {
            throw error
            
        }
        
    }


    //for photographers 
    async AdminGetAllModels():Promise<IModel[]>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const models= await this.modelrepository.find()
            return models
        } catch (error) {
            throw error
            
        }
        
    }

    async AdminGetOneModel(modelid:string):Promise<IModel>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const model= await this.modelrepository.findOne({where:{ModelID:modelid}})
            return model
        } catch (error) {
            throw error
            
        }
        
    }


    async AdminGetAllNotifications():Promise<INotification[]>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const notifications= await this.notificationrepository.find()
            return notifications
        } catch (error) {
            throw error
            
        }
        
    }

    async AdminGetAllContrats():Promise<IContract[]>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const notifications= await this.contractsrepository.find()
            return notifications
        } catch (error) {
            throw error
            
        }
        
    }

    async AdminGetAllContratsOfffer():Promise<IContractOffer[]>{
        try {
                //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)
            const notifications= await this.contractoffersrepository.find()
            return notifications
        } catch (error) {
            throw error
            
        }
        
    }

    ///delete tables and records 

    async deleteModel(modelid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findmodel =  await this.modelrepository.findOne({where:{ModelID:modelid}})
            if (!findmodel)throw new HttpException(`model with the id ${modelid} does not exist`,HttpStatus.NOT_FOUND)

            await this.modelrepository.remove(findmodel)
            const notification = new Notifications()
            notification.account= modelid
            notification.subject="Record deleted!"
            notification.notification_type=NotificationType.account_deleted
            notification.message=`the entire account of ${modelid} has been deleted by the admin`
            await this.notificationrepository.save(notification)

            return {message:`${findmodel.username} has been deleted as a model in walkway successfully`}
            
        } catch (error) {
            throw error
            
        }
    }

    async deleteVendor(vendorid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findvendor =  await this.vendorrepository.findOne({where:{VendorID:vendorid}})
            if (!findvendor)throw new HttpException(`vendor with the id ${vendorid} does not exist`,HttpStatus.NOT_FOUND)

            await this.vendorrepository.remove(findvendor)
            const notification = new Notifications()
            notification.account= vendorid
            notification.subject="Record deleted!"
            notification.notification_type=NotificationType.account_deleted
            notification.message=`the entire account of ${vendorid} has been deleted by the admin`
            await this.notificationrepository.save(notification)
            return {message:`${findvendor.brandname} has been deleted as a vendor on walkways successfully`}
            
        } catch (error) {
            
        }
    }

    async deletePhotogrpher(photoid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findphotographer =  await this.photorepository.findOne({where:{PhotographerID:photoid}})
            if (!findphotographer)throw new HttpException(`photographer with the id ${photoid} does not exist`,HttpStatus.NOT_FOUND)

            await this.photorepository.remove(findphotographer)
            const notification = new Notifications()
            notification.account= photoid
            notification.subject="Record deleted!"
            notification.notification_type=NotificationType.account_deleted
            notification.message=`the entire account of ${photoid} has been deleted by the admin`
            await this.notificationrepository.save(notification)
            return {message:`${findphotographer.username} has been deleted as a photographer on walkway successfully`}
            
        } catch (error) {
            
        }
    }

    async deleteCustomer(customerid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findcustomer =  await this.customerrepository.findOne({where:{CustomerID:customerid}})
            if (!findcustomer)throw new HttpException(`customer with the id ${customerid} does not exist`,HttpStatus.NOT_FOUND)

            await this.customerrepository.remove(findcustomer)
               //save the notification 
            const notification = new Notifications()
            notification.account= customerid
            notification.subject="Record deleted!"
            notification.notification_type=NotificationType.account_deleted
            notification.message=`the entire account of ${customerid} has been deleted by the admin`
            await this.notificationrepository.save(notification)
            return {message:` ${findcustomer.username} has been deleted as a customer on walkways successfully`}
  
            
        } catch (error) {
            throw error
            
        }
    }


    //verify various accounts before 

    async VerifyModelAccount(dto:VerifyAccountDto, modelid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findmodel =  await this.modelrepository.findOne({where:{ModelID:modelid}})
            if (!findmodel)throw new HttpException(`model with the id ${modelid} does not exist`,HttpStatus.NOT_FOUND)

            if (dto){
                findmodel.is_verified= true 
                await this.modelrepository.save(findmodel)
            }
            const notification = new Notifications()
            notification.account= modelid
            notification.subject="Account Verified!"
            notification.notification_type=NotificationType.account_verified
            notification.message=`the account of ${findmodel.username} has been verified by the admin`
            await this.notificationrepository.save(notification)
           
            return {message:`${findmodel.username} has been verified as a model in walkway`}
            
        } catch (error) {
            throw error
            
        }
        
    }

    async VerifyPhotographerAccount(dto:VerifyAccountDto, photolid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findphotographer =  await this.photorepository.findOne({where:{PhotographerID:photolid}})
            if (!findphotographer)throw new HttpException(`photographer with the id ${photolid} does not exist`,HttpStatus.NOT_FOUND)

            if (dto){
                findphotographer.is_verified= true 
                await this.photorepository.save(findphotographer)
            }
            const notification = new Notifications()
            notification.account= photolid
            notification.subject="Account Verified!"
            notification.notification_type=NotificationType.account_verified
            notification.message=`the account of ${findphotographer.username} has been verified by the admin`
            await this.notificationrepository.save(notification)
            return {message:`${findphotographer.username} has been verified as a photographer in walkway`}
            
            
        } catch (error) {
            throw error
            
        }
        
    }

    async VerifyCustomerAccount(dto:VerifyAccountDto, customerid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findcustomer =  await this.customerrepository.findOne({where:{CustomerID:customerid}})
            if (!findcustomer)throw new HttpException(`vendor with the id ${customerid} does not exist`,HttpStatus.NOT_FOUND)

            if (dto){
                findcustomer.is_verified= true 
                await this.customerrepository.save(findcustomer)
            }
            const notification = new Notifications()
            notification.account= customerid
            notification.subject="Account Verified!"
            notification.notification_type=NotificationType.account_verified
            notification.message=`the account of ${findcustomer.username} has been verified by the admin`
            await this.notificationrepository.save(notification)
            return {message:`${findcustomer.username} has been verified as a customer in walkway`}
            
        } catch (error) {
            throw error
            
        }
        
    }

    async VerifyVendorAccount(dto:VerifyAccountDto, vendorid:string):Promise<{message:string}>{
        try {
            //verify admin 
            // const admin = this.adminrepository.findOne({where:{id:id}})
            // if (!admin) throw new HttpException(`admin with ${id} not found`,HttpStatus.NOT_FOUND)

            const findvendor =  await this.vendorrepository.findOne({where:{VendorID:vendorid}})
            if (!findvendor)throw new HttpException(`vendor with the id ${vendorid} does not exist`,HttpStatus.NOT_FOUND)

            if (dto){
                findvendor.is_verified= true 
                await this.vendorrepository.save(findvendor)
            }
            const notification = new Notifications()
            notification.account= vendorid
            notification.subject="Account Verified!"
            notification.notification_type=NotificationType.account_verified
            notification.message=`the account of ${findvendor.brandname} has been verified by the admin`
            await this.notificationrepository.save(notification)
            return {message:`${findvendor.username} has been verified as a model in walkway`}
            


            
        } catch (error) {
            throw error
            
        }
        
    }

    




    
}