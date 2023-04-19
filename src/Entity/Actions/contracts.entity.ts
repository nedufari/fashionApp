import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FashionDesignerEntity } from "../users/fashiodesigner.entity";
import { FashionModelsEntity } from "../users/BrandModelsUsers/fashionmodels.entity";
import { SkincareModelsEntity } from "../users/BrandModelsUsers/skincaremodels.entity";
import { KidsModelsEntity } from "../users/BrandModelsUsers/kidsmodels.entity";
import { HairModelsEntity } from "../users/BrandModelsUsers/hairmodels.entity";
import { MakeUpModelsEntity } from "../users/BrandModelsUsers/makeupmodels.entity";
import { PhotographerEntity } from "../users/photographers.entity";
import { ContractDuration } from "../../Enums/contractduration.enum";

@Entity()
export class Contracts{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"date",nullable:false})
    commence_date:Date

    @Column({type:"date",nullable:false})
    expiration_date:Date


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    contract_duration:ContractDuration

    @Column({nullable:false})
    contract_worth:string

    @ManyToOne(()=>FashionDesignerEntity,(contractor:FashionDesignerEntity)=>contractor.brandname)
    fashion_mogul:FashionDesignerEntity

    @ManyToOne(()=>FashionModelsEntity||SkincareModelsEntity||KidsModelsEntity||HairModelsEntity||MakeUpModelsEntity,(model:FashionModelsEntity|SkincareModelsEntity|KidsModelsEntity|HairModelsEntity|MakeUpModelsEntity)=>model.username)
    fashion_model:FashionModelsEntity|SkincareModelsEntity|KidsModelsEntity|HairModelsEntity|MakeUpModelsEntity


    @ManyToOne(()=>PhotographerEntity,(photographer:PhotographerEntity)=>photographer.username)
    photographer:PhotographerEntity
}