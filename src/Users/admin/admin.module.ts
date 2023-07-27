import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { AdminEntity } from "../../Entity/Users/admin.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,AdminEntity])],
    providers:[AdminService],
    controllers:[AdminController]
})
export class AdminModule{}