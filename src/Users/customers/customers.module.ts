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
import { CustomerCartEntity } from "../../Entity/Cart/customer.cart.entity";
import { CustomerCartItemEntity } from "../../Entity/Cart/customer.cartitem.entity";
import { VendorProducts } from "../../Entity/VendorProducts/vendor.products.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comments,CustomerEntity,VendorPostsEntity,Replies,vendorEntity,Notifications,CustomerCartEntity,CustomerCartItemEntity,VendorProducts,CustomerCartEntity,CustomerCartItemEntity])],
    providers:[CustomerService,UploadService],
    controllers:[CustomerControlller]
})

export class CustomerModule{}