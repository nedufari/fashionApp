import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelEntity } from "../Users/model.entity";

export interface IModelTimeLine{
    id:number,
    createdDate:Date,
    caption:string,
    media:string[],
    likes:number,
    dislikes:number,
    owner: ModelEntity

}

interface IModelInfo {
    digital_photo: string;
    username: string;
}

export interface IModelTimeLineResponse{
    id:number,
    createdDate:Date,
    caption:string,
    media:string[],
    likes?:number,
    dislikes?:number,
    owner: IModelInfo

}



@Entity()
export class ModelTimelineEntity implements IModelTimeLine{
    
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
     @ManyToOne(()=> ModelEntity, (model)=>model.myTimeline)
     owner:ModelEntity
}