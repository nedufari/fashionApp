import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FashionModelsEntity } from "../../users/BrandModelsUsers/fashionmodels.entity";

@Entity()
export class FashionMdodelPostsEtity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    media:string

    @Column()
    captions:string

    @Column({type:'simple-array'})
    likes:string[]

    @Column({type:"simple-array"})
    shares:string[]

    @OneToOne(()=>FashionModelsEntity,(desginer:FashionModelsEntity)=> desginer.contractor)
    designer:FashionModelsEntity

    @OneToOne(()=>FashionModelsEntity,(photographer:FashionModelsEntity)=>photographer.photographer)
    photographer:FashionModelsEntity
}