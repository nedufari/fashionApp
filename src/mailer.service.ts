import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService{
    constructor(private readonly mailservice:MailerService){}

    async SendMail(to:string, subject:string, content:string):Promise<void>{
        await this.mailservice.sendMail({to,subject,html:content })
        
    }
}