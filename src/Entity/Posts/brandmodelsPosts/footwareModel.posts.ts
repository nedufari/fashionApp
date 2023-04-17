import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FootwearModelsEntity } from "../../users/BrandModelsUsers/footwaremodels.entity";

@Entity()
export class FootwareMdodelPostsEntity{
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

    @OneToOne(()=>FootwearModelsEntity,(desginer:FootwearModelsEntity)=> desginer.contractor)
    designer:FootwearModelsEntity

    @OneToOne(()=>FootwearModelsEntity,(photographer:FootwearModelsEntity)=>photographer.photographer)
    photographer:FootwearModelsEntity 
} 