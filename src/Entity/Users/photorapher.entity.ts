import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { PaymentPlan } from "../../Enums/paymentOption.enum"
import { Roles } from "../../Enums/roles.enum"
import { IPhotographer } from "../../Users/photographers/photo.interface"
import { Comments } from "../Activities/comment.entity"
import { Replies } from "../Activities/reply.entity"
import { Negotiable, TypeOfContract } from "../../Enums/contract.enum"
import { VendorPostsEntity } from "../Posts/vendor.post.entity"
import { PhotographerTimelineEntity } from "../Posts/photographer.timeline.entity"

@Entity()
export class PhotographerEntity implements IPhotographer{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column()
    PhotographerID:string

    @Column({unique:true,nullable:false})
    email:string

    
   

    @Column({unique:true,nullable:true})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true,unique:true})
    fullname:string

    @Column({nullable:true})
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.PHOTOGRAPHER})
    role:Roles

    @Column({length:11,nullable:true})
    phone1:string

    @Column({length:11,nullable:true})
    phone2:string

    @Column({length:300,nullable:true})
    bio:string

    @Column({nullable:true})
    age:number

    @Column({nullable:true})
    gender:string

    @Column({nullable:true})
    state_of_residence:string

    @CreateDateColumn()
    cratedDate:Date

    @Column({nullable:true})
    facebook:string

    @Column({nullable:true})
    instagram:string

    @Column({nullable:true})
    twitter:string

    @Column({nullable:true})
    tiktok:string

    @Column({nullable:true})
    thread:string

    @Column({nullable:true})
    snapchat:string


    @Column({nullable:true})
    pricerange: string 

    @Column({type:'enum',enum:Negotiable,nullable:true})
    negotiable:Negotiable

    @Column({nullable:true})
    displayPicture:string


    @Column({type:"enum", enum:PaymentPlan,nullable:true})
    paymentplan:PaymentPlan

    @Column({type:"boolean", default:false,nullable:true})
    is_active:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_verified:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_deleted:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_profile_completed:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_on_contract:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_contract_terminated:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_logged_in:boolean

    @Column({type:"boolean", default:false,nullable:true})
    is_logged_out:boolean

    @Column({type:"date", nullable:true})
    last_login:Date

    @Column({ default:0,nullable:true})
    login_count:number

    @Column({type:"boolean", default:false,nullable:true})
    is_locked:boolean

    @Column({nullable:true})
    is_locked_until:Date

    @Column({nullable:true})
    password_reset_link:string

    @Column({nullable:true})
    reset_link_exptime:Date

    @Column({type:"boolean", nullable:true})
    is_onContract:boolean

    @Column({nullable:true,type:"enum", enum:TypeOfContract})
    type_of_contract:TypeOfContract

    @OneToMany(()=>Comments,comment=>comment.photographer)
    comments:Comments[]

    @OneToMany(()=>Replies,reply=>reply.photographer)
    replies:Replies[]

    @OneToMany(()=>PhotographerTimelineEntity,(modeltimeline)=>modeltimeline.owner)
    myTimeline:PhotographerTimelineEntity[]

}