import { Module } from "@nestjs/common";
import { ModelController } from "./model.controller";
import { ModelService } from "./model.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { UploadService } from "../../uploads.service";
import { ModelTimelineEntity } from "../../Entity/Posts/model.timeline.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity,CounterContractsOfffer,VendorPostsEntity,ModelTimelineEntity])],
    controllers:[ModelController],
    providers:[ModelService,UploadService]
})

export class ModelModule{}