import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FashionModelsEntity } from "../../users/BrandModelsUsers/fashionmodels.entity";

@Entity()
export class FashionMdodelPostsEtity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({nullable:true})
    media:string

    @Column({nullable:true})
    captions:string

    @Column({type:"simple-array",nullable:true})
    likes:string[]

    @Column({type:"simple-array",nullable:true})
    shares:string[]

    @Column({type:"simple-array",nullable:true})
    comments:string[]

    @OneToOne(()=>FashionModelsEntity,(desginer:FashionModelsEntity)=> desginer.contractor)
    designer:FashionModelsEntity

    @OneToOne(()=>FashionModelsEntity,(photographer:FashionModelsEntity)=>photographer.photographer)
    photographer:FashionModelsEntity
}