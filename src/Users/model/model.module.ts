import { Module } from "@nestjs/common";
import { ModelController } from "./model.controller";
import { ModelService } from "./model.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsOfffer } from "../../Entity/contractoffer.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";

@Module({
    imports:[TypeOrmModule.forFeature([ContractsOfffer,ModelEntity])],
    controllers:[ModelController],
    providers:[ModelService]
})

export class ModelModule{}