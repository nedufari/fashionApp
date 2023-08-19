
import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Roles } from "../../Enums/roles.enum"
import { IVendor } from "../../Users/vendor/vendor.interface"
import { Comments } from "../Activities/comment.entity"
import { Replies } from "../Activities/reply.entity"
import { VendorPostsEntity } from "../Posts/vendor.post.entity"
import { Niche4Vendors } from "../../Enums/niche.enum"

@Entity()
export class vendorEntity implements IVendor{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column()
    VendorID:string

    @Column({unique:true,nullable:false})
    email:string

    
    @Column({unique:true,nullable:true})
    brandname:string 

    @Column({unique:true,nullable:true})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true,unique:true})
    fullname:string

    
    @Column({nullable:true,unique:true})
    bio:string

    @Column({type:"enum", enum:Roles, default:Roles.VENDOR})
    role:Roles

    @Column({length:11,nullable:true})
    phone1:string

    @Column({type:"enum", enum:Niche4Vendors,nullable:true})
    niche: Niche4Vendors

    @Column({length:11,nullable:true})
    phone2:string

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
    address:string

    @Column({nullable:true})
    display_photo:string 

    @Column({nullable:true})
    gender:string 

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

    @OneToMany(()=>Comments,comment=>comment.vendor)
    comments:Comments[]

    @OneToMany(()=>Replies,reply=>reply.vendor)
    replies:Replies[]

    @OneToMany(()=>VendorPostsEntity,(vendorPost)=>vendorPost.owner)
    myposts:VendorPostsEntity[]

}