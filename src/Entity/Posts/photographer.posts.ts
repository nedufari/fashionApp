import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PhotographerEntity } from "../users/photographers.entity";

@Entity()
export class PhotographerPostsEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    media:string

    @Column()
    captions:string

    @OneToOne(()=>PhotographerEntity,(desginer:PhotographerEntity)=> desginer.contractor)
    designer:PhotographerEntity

    @OneToOne(()=>PhotographerEntity,(model:PhotographerEntity)=>model.modelscontractedto)
    brandmodel:PhotographerEntity
}