import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FashionModelsEntity } from "../../users/BrandModelsUsers/fashionmodels.entity";
import { HairModelsEntity } from "../../users/BrandModelsUsers/hairmodels.entity";
import { MakeUpModelsEntity } from "../../users/BrandModelsUsers/makeupmodels.entity";

@Entity()
export class MakeUpMdodelPostsEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    media:string

    @Column({length:300})
    captions:string

    @CreateDateColumn()
    cratedDate:Date

    @Column({type:'simple-array'})
    likes:string[]

    @Column({type:"simple-array"})
    shares:string[]

    @Column({type:"simple-array"})
    comments:string[]

    @OneToOne(()=>MakeUpModelsEntity,(desginer:MakeUpModelsEntity)=> desginer.contractor)
    makeup_artiste:MakeUpModelsEntity

    @OneToOne(()=>MakeUpModelsEntity,(photographer:MakeUpModelsEntity)=>photographer.photographer)
    photographer:MakeUpModelsEntity
} 