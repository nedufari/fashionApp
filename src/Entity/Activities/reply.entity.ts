import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ModelEntity } from "../Users/model.entity"
import { PhotographerEntity } from "../Users/photorapher.entity"
import { AdminEntity } from "../Users/admin.entity"
import { CustomerEntity } from "../Users/customer.entity"
import { Comments } from "./comment.entity"
import { vendorEntity } from "../Users/vendor.entity"

export interface IReplies{
    id:number 
    reply:string 
    model:ModelEntity
    admin:AdminEntity
    customer:CustomerEntity
    photographer:PhotographerEntity
    comment:Comments
}

export interface IRepliesResponses{
    reply:string 
    model:ModelEntity
    admin?:AdminEntity
    customer:CustomerEntity
    photographer:PhotographerEntity
}

interface ICustomerInfo {
    digital_photo: string;
    username: string;
}

interface ICommentReplied {
    comment:string
    
}
export interface ICustomerReplyResponse {
    id: number
    reply: string
    customer: ICustomerInfo
    comment : ICommentReplied
   
}

export interface IModelReplyResponse {
    id: number
    reply: string
    model: Partial<ModelEntity>;
    comment : ICommentReplied
   
}

@Entity()
export class Replies implements IReplies{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    reply:string

    @ManyToOne(()=>ModelEntity,modelentity=>modelentity.comments)
    model:ModelEntity;

    @ManyToOne(()=>PhotographerEntity,photographerentity=>photographerentity.comments)
    photographer:PhotographerEntity

    @ManyToOne(()=>AdminEntity,adminentity=>adminentity.comments)
    admin:AdminEntity

    @ManyToOne(()=>CustomerEntity,customerentity=>customerentity.comments)
    customer:CustomerEntity

    @ManyToOne(()=>vendorEntity,vendorentity=>vendorentity.comments)
    vendor:vendorEntity

    @ManyToOne(()=>Comments,comment=>comment.replies)
    comment:Comments;

}