import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MailService } from "../../mailer.service";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { AdminEntityRepository, CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository, WalletRepository } from "../../auth/auth.repository";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { UserOtp } from "../../Entity/userotp.entity";
import { ContractOfferRepository, ContractRepository } from "../../contract/contrct.repository";
import { Contracts } from "../../Entity/contracts.entity";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { Notifications } from "../../Entity/Notification/notification.entity";
import { Wallet } from "../../Entity/wallet/wallet.entity";
import { KindOfModel } from "../../Enums/modelType.enum";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { SendEmailToUsersDto } from "./admin.dto";

@Injectable()
export  class CustomerCareAdminService {
    constructor(private readonly mailservice:MailService,
        @InjectRepository(AdminEntity)private adminripo:AdminEntityRepository,
        @InjectRepository(vendorEntity)private vendorrepository:VendorEntityRepository,
    @InjectRepository(PhotographerEntity)private photorepository:PhotographerEntityRepository,
    @InjectRepository(ModelEntity)private modelrepository:ModelEntityRepository,
    @InjectRepository(UserOtp)private otprepository:OtpRepository,
    @InjectRepository(Contracts)private contractsrepository:ContractRepository,
    @InjectRepository(ContractsOfffer)private contractoffersrepository:ContractOfferRepository,
    @InjectRepository(Notifications)private notificationrepository:NotificationsRepository,
    @InjectRepository(CustomerEntity)private customerrepository:CustomerEntityRepository,
    @InjectRepository(Wallet) private readonly walletripo:WalletRepository){}


    //get all user email address

    private async getAllVendorEmail():Promise<string[]>{
        const vendor = await this.vendorrepository.find()
        const emailadress= vendor.map((vendors)=>vendors.email)
        return emailadress
    }

    private async getAllPhotographerEmail():Promise<string[]>{
        const vendor = await this.photorepository.find()
        const emailadress= vendor.map((vendors)=>vendors.email)
        return emailadress
    }

    private async getAllModelEmail():Promise<string[]>{
        const vendor = await this.modelrepository.find()
        const emailadress= vendor.map((vendors)=>vendors.email)
        return emailadress
    }

    private async getAllCustomerEmail():Promise<string[]>{
        const vendor = await this.customerrepository.find()
        const emailadress= vendor.map((vendors)=>vendors.email)
        return emailadress
    }

    private async getAllAdminEmail():Promise<string[]>{
        const vendor = await this.adminripo.find()
        const emailadress= vendor.map((vendors)=>vendors.email)
        return emailadress
    }



    //get total number of all the respective users 
    async TotalVendor():Promise<number>{
        const totalvendor =await this.vendorrepository.count()
        return totalvendor
    }

    async TotalPhotographer():Promise<number>{
        const totalvendor =await this.photorepository.count()
        return totalvendor
    }

    async Totalmodel():Promise<number>{
        const totalvendor =await this.modelrepository.count()
        return totalvendor
    }

    async Totalcustomer():Promise<number>{
        const totalvendor =await this.customerrepository.count()
        return totalvendor
    }

    async totalnumberOfAllUsers():Promise<number>{
        const totalusers = (await this.TotalPhotographer() + await this.TotalVendor() + await this.Totalcustomer() + await this.Totalmodel())
        return totalusers 
    }





    
    //send news articles and updates to the email address of all the users depending on who you want to send it to 
    async sendEmailArticlesToallUsers(adminid:string,dto:SendEmailToUsersDto):Promise<{message:string}>{
        try {

        const admin = await this.adminripo.findOne({ where: { id: adminid } });
        if (!admin)throw new HttpException(`super admin with ${adminid} not found`,HttpStatus.NOT_FOUND);

        const customerEmails = await this.getAllCustomerEmail()
        const vendorEmails = await this.getAllVendorEmail()
        const modelEmails = await this.getAllModelEmail()
        const photographerEmails = await this.getAllPhotographerEmail()

        const allEmails = [...customerEmails, ...vendorEmails, ...modelEmails, ...photographerEmails]

        for (const email of allEmails){
            try {
                //send mails 
                await this.mailservice.SendRandomMail(dto.content,email,dto.subject)
                
            } catch (error) {
                throw error 
                
            }
        }

        return {message:'mail has been sent to all users '}
            
        } catch (error) {
            throw error 
            
        }
    }



    async sendEmailArticlesToCustomers(adminid:string,dto:SendEmailToUsersDto):Promise<{message:string}>{
        try {

        const admin = await this.adminripo.findOne({ where: { id: adminid } });
        if (!admin)throw new HttpException(`super admin with ${adminid} not found`,HttpStatus.NOT_FOUND);

        const customerEmails = await this.getAllCustomerEmail()
       

        const allEmails = [...customerEmails]

        for (const email of allEmails){
            try {
                //send mails 
                await this.mailservice.SendRandomMail(dto.content,email,dto.subject)
                
            } catch (error) {
                throw error 
                
            }
        }

        return {message:'mail has been sent to all customers '}
    
        } catch (error) {
            throw error 
            
        }
    }

    async sendEmailArticlesToVendors(adminid:string,dto:SendEmailToUsersDto):Promise<{message:string}>{
        try {

        const admin = await this.adminripo.findOne({ where: { id: adminid } });
        if (!admin)throw new HttpException(`super admin with ${adminid} not found`,HttpStatus.NOT_FOUND);

        const vendorEmails = await this.getAllVendorEmail()
       

        const allEmails = [...vendorEmails]

        for (const email of allEmails){
            try {
                //send mails 
                await this.mailservice.SendRandomMail(dto.content,email,dto.subject)
                
            } catch (error) {
                throw error 
                
            }
        }

        return {message:'mail has been sent to all vendors '}
    
        } catch (error) {
            throw error 
            
        }
    }


    async sendEmailArticlesToModels(adminid:string,dto:SendEmailToUsersDto):Promise<{message:string}>{
        try {

        const admin = await this.adminripo.findOne({ where: { id: adminid } });
        if (!admin)throw new HttpException(`super admin with ${adminid} not found`,HttpStatus.NOT_FOUND);

        const modelEmails = await this.getAllModelEmail()
       

        const allEmails = [...modelEmails]

        for (const email of allEmails){
            try {
                //send mails 
                await this.mailservice.SendRandomMail(dto.content,email,dto.subject)
                
            } catch (error) {
                throw error 
                
            }
        }

        return {message:'mail has been sent to all models '}
    
        } catch (error) {
            throw error 
            
        }
    }

    async sendEmailArticlesToPhotographers(adminid:string,dto:SendEmailToUsersDto):Promise<{message:string}>{
        try {

        const admin = await this.adminripo.findOne({ where: { id: adminid } });
        if (!admin)throw new HttpException(`super admin with ${adminid} not found`,HttpStatus.NOT_FOUND);

        const photographerEmails = await this.getAllPhotographerEmail()
       

        const allEmails = [...photographerEmails]

        for (const email of allEmails){
            try {
                //send mails 
                await this.mailservice.SendRandomMail(dto.content,email,dto.subject)
                
            } catch (error) {
                throw error 
                
            }
        }

        return {message:'mail has been sent to all models '}
    
        } catch (error) {
            throw error 
            
        }
    }



}

