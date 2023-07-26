import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ModelEntity } from "../Users/model.entity"
import { PhotographerEntity } from "../Users/photorapher.entity"
import { AdminEntity } from "../Users/admin.entity"
import { CustomerEntity } from "../Users/customer.entity"
import { Replies } from "./reply.entity"
import { vendorEntity } from "../Users/vendor.entity"

export interface IComment{
    id:number 
    content:string 
    model:ModelEntity
    admin:AdminEntity
    customer:CustomerEntity
    photographer:PhotographerEntity
    replies:Replies[]
}

export interface ICommentResponses{
    content:string 
    model:ModelEntity
    admin?:AdminEntity
    customer:CustomerEntity
    photographer:PhotographerEntity
}

@Entity()
export class Comments implements IComment{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    content:string

    @ManyToOne(()=>ModelEntity,modelentity=>modelentity.comments)
    model:ModelEntity;

    @ManyToOne(()=>PhotographerEntity,photographerentity=>photographerentity.comments)
    photographer:PhotographerEntity

    @ManyToOne(()=>AdminEntity,adminentity=>adminentity.comments)
    admin:AdminEntity

    @ManyToOne(()=>CustomerEntity,customerentity=>customerentity.comments)
    customer:CustomerEntity

    @ManyToOne(()=>vendorEntity,vendorentity=>vendorentity.comments)
    vendor:CustomerEntity

    @OneToMany(()=>Replies,reply=>reply.comment)
    replies:Replies[];

}