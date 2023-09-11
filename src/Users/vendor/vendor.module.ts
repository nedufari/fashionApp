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
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { VendorController } from "./vendor.controller";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { UploadService } from "../../uploads.service";
import { VendorProducts } from "../../Entity/VendorProducts/vendor.products.entity";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,AdminEntity,vendorEntity,PhotographerEntity,ModelEntity,Contracts,ContractsOfffer,Notifications,UserOtp,Comments,Replies,Likes,VendorPostsEntity,ContractsOfffer,CounterContractsOfffer,VendorProducts])],
    controllers:[VendorController],
    providers:[VendorService,UploadService]
})
export class VendorModule{}