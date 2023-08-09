import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { Contracts } from "../../Entity/contracts.entity";
import { Notifications } from "../../Entity/Notification/notification.entity";
import { UserOtp } from "../../Entity/userotp.entity";
import { Comments } from "../../Entity/Activities/comment.entity";
import { Replies } from "../../Entity/Activities/reply.entity";
import { Likes } from "../../Entity/Activities/likes.entity";
import { VendorService } from "./vendor.service";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,AdminEntity,vendorEntity,PhotographerEntity,ModelEntity,Contracts,Notifications,UserOtp,Comments,Replies,Likes])],
    controllers:[],
    providers:[VendorService]
})
export class VendorModule{}