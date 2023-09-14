import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomerCareAdminService } from "./customerCare.admin.service";
import { SendEmailToUsersDto } from "./admin.dto";

@Controller('customercare')
export class CustomerCareAdminController{
    constructor(private readonly customercaseservice:CustomerCareAdminService){}

// fetching the total of all customers 

    @Get('totalVendor')
    async gettotalVendors():Promise<number>{
        return await this.customercaseservice.TotalVendor()
    }

    @Get('totalphotographer')
    async gettotalPhotographer():Promise<number>{
        return await this.customercaseservice.TotalPhotographer()
    }

    @Get('totalmodel')
    async gettotalModel():Promise<number>{
        return await this.customercaseservice.Totalmodel()
    }

    @Get('totalcustomer')
    async gettotalCustomer():Promise<number>{
        return await this.customercaseservice.Totalcustomer()
    }

    @Get('totalusers')
    async gettotalWalkwayUsers():Promise<number>{
        return await this.customercaseservice.totalnumberOfAllUsers()
    }

    //mailing service 

    @Post('send-mail-to-all/:id')
    async SendMailToAll(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToallUsers(id,dto)
    }

    @Post('send-mail-to-vendors/:id')
    async SendMailToAllVendors(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToVendors(id,dto)
    }

    @Post('send-mail-to-customers/:id')
    async SendMailToAllCustomers(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToCustomers(id,dto)
    }

    @Post('send-mail-to-models/:id')
    async SendMailToAllModels(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToModels(id,dto)
    }

    @Post('send-mail-to-all/:id')
    async SendMailToAllPhotographers(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToPhotographers(id,dto)
    }






}

