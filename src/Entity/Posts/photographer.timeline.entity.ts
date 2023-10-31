import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelEntity } from "../Users/model.entity";
import { PhotographerEntity } from "../Users/photorapher.entity";

export interface IPhotographerTimeLine{
    id:number,
    createdDate:Date,
    caption:string,
    media:string[],
    likes:number,
    dislikes:number,
    owner: PhotographerEntity

}

interface IPhotographerInfo {
    displayPicture: string;
    brandname: string;
}

export interface IPhotographerTimeLineResponse{
    id:number,
    createdDate:Date,
    caption:string,
    media:string[],
    likes?:number,
    dislikes?:number,
    owner: IPhotographerInfo

}



@Entity()
export class PhotographerTimelineEntity implements IPhotographerTimeLine{
    
    @PrimaryGeneratedColumn()
    id :number

    @CreateDateColumn()
    createdDate:Date

    @Column({type:'jsonb',nullable:true,})
    media:string[]

    @Column({nullable:true})
    likes :number 

    @Column({nullable:true})
    dislikes:number

    @Column({nullable:true})
    caption:string

     //relationship
     @ManyToOne(()=> PhotographerEntity, (photographer)=>photographer.myTimeline)
     owner:PhotographerEntity
}