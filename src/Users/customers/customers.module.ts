import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comments } from "../../Entity/Activities/comment.entity";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { CustomerService } from "./customers.service";
import { CustomerControlller } from "./customers.controller";
import { Replies } from "../../Entity/Activities/reply.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comments,CustomerEntity,VendorPostsEntity,Replies])],
    providers:[CustomerService],
    controllers:[CustomerControlller]
})

export class CustomerModule{}