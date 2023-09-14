import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomerCareAdminService } from "./customerCare.admin.service";
import { SendEmailToUsersDto } from "./admin.dto";

@Controller('customercare')
export class CustomerCareAdminController{
    constructor(private readonly customercaseservice:CustomerCareAdminService){}


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

    @Post('send-mail-to-all/:id')
    async SendMailToAll(@Param('id')id:string, @Body()dto:SendEmailToUsersDto):Promise<{message:string}>{
        return await this.customercaseservice.sendEmailArticlesToallUsers(id,dto)
    }






}

