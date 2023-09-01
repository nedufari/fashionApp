import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comments } from "../../Entity/Activities/comment.entity";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { CustomerService } from "./customers.service";
import { CustomerControlller } from "./customers.controller";
import { Replies } from "../../Entity/Activities/reply.entity";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { UploadService } from "../../uploads.service";
import { Notifications } from "../../Entity/Notification/notification.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comments,CustomerEntity,VendorPostsEntity,Replies,vendorEntity,Notifications])],
    providers:[CustomerService,UploadService],
    controllers:[CustomerControlller]
})

export class CustomerModule{}