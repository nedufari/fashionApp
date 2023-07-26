import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ModelEntity } from "../Users/model.entity"
import { PhotographerEntity } from "../Users/photorapher.entity"
import { AdminEntity } from "../Users/admin.entity"
import { CustomerEntity } from "../Users/customer.entity"
import { Replies } from "./reply.entity"
import { vendorEntity } from "../Users/vendor.entity"
import { IModelResponse, IModelResponseComment } from "../../Users/model/model.interface"
import { IAdminResponse, IAdminResponseComment } from "../../Users/admin/admin.interface"
import { IPhotographer, IPhotographerResponseComment } from "../../Users/photographers/photo.interface"
import { IVendorResponse, IVendorResponseComment } from "../../Users/vendor/vendor.interface"
import { Comments } from "./comment.entity"

export interface ILike{
    id:number 
    comment:Comments 
    model:ModelEntity
    admin?:AdminEntity
    customer:CustomerEntity
    photographer:PhotographerEntity
    
}

export interface ILikeResponses{
    comment:string 
    model:IModelResponseComment
    admin:IAdminResponseComment
    customer:IAdminResponseComment
    photographer:IPhotographerResponseComment
    vendor:IVendorResponseComment
}

@Entity()
export class Likes implements ILike{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Comments,commententity=>commententity.content)
    comment:Comments

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

}