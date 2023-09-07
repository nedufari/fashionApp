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
import { Notifications } from "../../Entity/Notification/notification.entity";
import { Replies } from "../../Entity/Activities/reply.entity";
import { Comments } from "../../Entity/Activities/comment.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity,CounterContractsOfffer,VendorPostsEntity,ModelTimelineEntity,Notifications,Replies,Comments])],
    controllers:[ModelController],
    providers:[ModelService,UploadService]
})

export class ModelModule{}