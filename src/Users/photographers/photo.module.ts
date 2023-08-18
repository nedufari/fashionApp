import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { CounterContractsOfffer } from "../../Entity/countercontractOffer.entity";
import { PhotographerService } from "./photo.service";
import { PhotographerController } from "./photo.controller";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity,CounterContractsOfffer,PhotographerEntity])],
    controllers:[PhotographerController],
    providers:[PhotographerService]
})

export class PhotographerModule{}