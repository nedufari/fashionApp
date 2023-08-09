import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { vendorEntity } from "../Users/vendor.entity";
import { ModelEntity } from "../Users/model.entity";
import { PhotographerEntity } from "../Users/photorapher.entity";
import { Comments } from "../Activities/comment.entity";


export interface IVendoPost{
    id:number,
    caption:string,
    media:string[],
    createdDate:Date
    owner:vendorEntity
    creditedModel:string,
    creditedPhotographer:string
    comments?:Comments[]
}

export interface IVendorPostResponse{
    caption:string,
    media:string[],
    createdDate:Date
    owner:vendorEntity
    creditedModel:string,
    creditedPhotographer:string
    

}

export interface IvndorPostResponseWithComments{
    caption:string,
    media:string[],
    createdDate:Date
    owner:vendorEntity
    creditedModel:string,
    creditedPhotographer:string

}

@Entity()
export class VendorPostsEntity implements IVendoPost{
    
    @PrimaryGeneratedColumn()
    id :number

    @Column({nullable:true,length:400})
    caption:string

    @CreateDateColumn()
    createdDate:Date

    //video or picture 
    @Column({type:'jsonb',nullable:true,})
    media:string[]


    //relationship
    @ManyToOne(()=> vendorEntity, (vendor)=>vendor.myposts)
    owner:vendorEntity

    @Column()
    creditedModel:string

   @Column()
    creditedPhotographer:string

    //activities
    @OneToMany(()=>Comments,(comments)=>comments.vendor)
    comments:Comments[]



    


    

    

    
}