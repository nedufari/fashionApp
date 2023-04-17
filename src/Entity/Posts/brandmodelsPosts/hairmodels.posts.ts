import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HairModelsEntity } from "../../users/BrandModelsUsers/hairmodels.entity";

@Entity()
export class HairMdodelPostsEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({nullable:true})
    media:string

    @Column({length:300,nullable:true})
    captions:string

    @CreateDateColumn()
    cratedDate:Date

    @Column({type:"simple-array",nullable:true})
    likes:string[]

    @Column({type:"simple-array",nullable:true})
    shares:string[]

    @Column({type:"simple-array",nullable:true})
    comments:string[]

    @OneToOne(()=>HairModelsEntity,(desginer:HairModelsEntity)=> desginer.contractor)
    designer:HairModelsEntity

    @OneToOne(()=>HairModelsEntity,(photographer:HairModelsEntity)=>photographer.photographer)
    photographer:HairModelsEntity
} 