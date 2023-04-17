import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PhotographerEntity } from "../users/photographers.entity";

@Entity()
export class PhotographerPostsEntity{
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

    @OneToOne(()=>PhotographerEntity,(desginer:PhotographerEntity)=> desginer.contractor)
    designer:PhotographerEntity

    @OneToOne(()=>PhotographerEntity,(model:PhotographerEntity)=>model.modelscontractedto)
    brandmodel:PhotographerEntity
}