import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerService } from "./photo.service";
import { PhotographerController } from "./photo.controller";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { VendorPostsEntity } from "../../Entity/Posts/vendor.post.entity";
import { PhotographerTimelineEntity } from "../../Entity/Posts/photographer.timeline.entity";
import { UploadService } from "../../uploads.service";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity,CounterContractsOfffer,PhotographerEntity,VendorPostsEntity,PhotographerTimelineEntity])],
    controllers:[PhotographerController],
    providers:[PhotographerService,UploadService]
})

export class PhotographerModule{}