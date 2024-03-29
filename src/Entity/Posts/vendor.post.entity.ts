import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { vendorEntity } from "../Users/vendor.entity";
import { ModelEntity } from "../Users/model.entity";
import { PhotographerEntity } from "../Users/photorapher.entity";
import { Comments } from "../Activities/comment.entity";
import { Availability } from "../../Enums/post.enum";
import { Replies } from "../Activities/reply.entity";
import { VendorProducts } from "../VendorProducts/vendor.products.entity";


export interface IVendoPost{
    id:number,
    caption:string,
    media:string[],
    availability:Availability,
    cost:number
    createdDate:Date
    owner:vendorEntity
    creditedModel:string,
    likes:number,
    dislikes:number,
    likedBy:string[],
    dislikedBy:string[]
    creditedPhotographer:string
    comments?:Comments[]
    products: VendorProducts[]

}

interface IVendorInfo {
    display_photo: string;
    brandname: string;
}

export interface IProductinfo{
    image:string[]
    price:number
}




export interface IVendorPostResponse{
    id:number
    caption:string,
    media:string[],
    availability:Availability,
    cost:number
    createdDate:Date
    owner:IVendorInfo
    creditedModel:string,
    creditedPhotographer:string
    products: IProductinfo
    

}

interface ReplyResponse {
    id: number;
    reply: string;
    // Add other reply properties you need
}

interface CommentResponse {
    id: number;
    content: string;
    replies?: ReplyResponse[];
}



export interface IvndorPostResponseWithComments{
    id:number
    caption:string,
    media:string[],
    availability:Availability,
    cost:number
    createdDate:Date
    owner:IVendorInfo
    creditedModel:string,
    creditedPhotographer:string
    likes?:number,
    dislikes?:number,
    likedBy?:string[],
    dislikedBy?:string[]
    comments?:CommentResponse[]
    products: IProductinfo[]

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

    @Column({type:'enum',enum:Availability,nullable:false})
    availability:Availability

    @Column({nullable:true})
    cost:number

    @Column({nullable:true})
    likes :number 

    @Column({nullable:true})
    dislikes:number

    @Column({type:"simple-array",nullable:true})
    likedBy:string[]

    @Column({type:"simple-array",nullable:true})
    dislikedBy:string[]



    //relationship
    @ManyToOne(()=> vendorEntity, (vendor)=>vendor.myposts,)
    owner:vendorEntity

    @Column()
    creditedModel:string

   @Column()
    creditedPhotographer:string

    //activities
    @OneToMany(()=>Comments,(comments)=>comments.vendor,)
    comments:Comments[]

    @OneToMany(()=>VendorProducts,(product)=>product.post, { cascade: true, onDelete: 'CASCADE' })
    products: VendorProducts[]

    



    


    

    

    
}