import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { KidsModelsEntity } from "../../users/BrandModelsUsers/kidsmodels.entity";

@Entity()
export class KidsMdodelPostsEntity{
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

    @OneToOne(()=>KidsModelsEntity,(desginer:KidsModelsEntity)=> desginer.contractor)
    designer:KidsModelsEntity

    @OneToOne(()=>KidsModelsEntity,(photographer:KidsModelsEntity)=>photographer.photographer)
    photographer:KidsModelsEntity
} 