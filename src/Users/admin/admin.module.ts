import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { Contracts } from "../../Entity/contracts.entity";
import { Notifications } from "../../Entity/Notification/notification.entity";
import { UserOtp } from "../../Entity/userotp.entity";
import { Comments } from "../../Entity/Activities/comment.entity";
import { Replies } from "../../Entity/Activities/reply.entity";
import { Likes } from "../../Entity/Activities/likes.entity";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { Wallet } from "../../Entity/wallet/wallet.entity";
import { SuperAdminService } from "./superAdmin.service";
import { SuperAdmincontroller } from "./superAdmin.controller";
import { CustomerCareAdminService } from "./customerCare.admin.service";
import { CustomerCareAdminController } from "./customerCare.controller";
import { MailService } from "../../mailer.service";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,AdminEntity,vendorEntity,PhotographerEntity,ModelEntity,Contracts,Notifications,UserOtp,Comments,Replies,Likes,ContractsOfffer,CounterContractsOfffer,Wallet])],
    providers:[AdminService,SuperAdminService,CustomerCareAdminService,MailService],
    controllers:[AdminController,SuperAdmincontroller,CustomerCareAdminController]
})
export class AdminModule{}