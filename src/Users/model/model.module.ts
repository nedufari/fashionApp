import { Module } from "@nestjs/common";
import { ModelController } from "./model.controller";
import { ModelService } from "./model.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity,CounterContractsOfffer,VendorPostsEntity])],
    controllers:[ModelController],
    providers:[ModelService]
})

export class ModelModule{}