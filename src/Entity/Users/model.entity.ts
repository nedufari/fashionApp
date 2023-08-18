import { Column, CreateDateColumn, Double, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";
import { ContractDuration, TypeOfContract } from "../../Enums/contract.enum";
import { KindOfModel } from "../../Enums/modelType.enum";
import { PaymentPlan } from "../../Enums/paymentOption.enum";
import { IModel } from "../../Users/model/model.interface";
import { Comments } from "../Activities/comment.entity";
import { Replies } from "../Activities/reply.entity";
import { VendorPostsEntity } from "../Posts/vendor.post.entity";

@Entity()
export class ModelEntity implements IModel{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({nullable:true})
    ModelID:string

    @Column({unique:true,nullable:false})
    email:string

    
    @Column({unique:true,nullable:true})
    brandname:string 

    @Column({unique:true,nullable:true})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true})
    fullname:string

    //parents either dad or mum or guardian 
    @Column({nullable:true})
    manager:string

    @Column({nullable:true})
    address:string

    @Column({type:"enum", enum:Roles,default:Roles.MODEL})
    role:Roles

    @Column({length:11,nullable:true})
    phone1:string

    @Column({length:11,nullable:true})
    phone2:string

    @Column({length:11,nullable:true})
    ManagerPhone:string

    @Column({length:300,nullable:true})
    bio:string

    @Column({nullable:true})
    age:number

    @Column({nullable:true})
    gender:string

    @Column({nullable:true})
    state_of_residence:string

    @Column({nullable:true})
    complexion:string 

    @Column({nullable:true})
    height_in_ft:string

    @Column({nullable:true})
    weight_in_kg:string 

    @Column({type:"boolean",default:false})
    on_low_cut:boolean

    @CreateDateColumn()
    cratedDate:Date

// social media handle 
    @Column({nullable:true})
    facebook:string

    @Column({nullable:true})
    instagram:string

    @Column({nullable:true})
    twitter:string

    @Column({nullable:true})
    tiktok:string

    @Column({nullable:true})
    snapchat:string

    @Column({nullable:true})
    thread:string

    @Column({nullable:true})
    digital_photo:string

//maager social media handle 
    @Column({nullable:true})
    Managerfacebook:string

    @Column({nullable:true})
    Managerinstagram:string

    @Column({nullable:true})
    Managertwitter:string



/// entities about dress sizes for already sewn dresses 
    @Column({nullable:true})
    gown_size:string

    @Column({nullable:true})
    blouse_size:string

    @Column({nullable:true})
    skirt_size:string

    @Column({nullable:true})
    trouser_size:string

    @Column({nullable:true})
    shirt_size:string

    @Column({nullable:true})
    hat_size:string

    @Column({nullable:true})
    fashion_genre: string 

/// measurements for fresh sewn dresses

@Column({nullable:true})
shoulder:string

@Column({nullable:true})
burst:string

@Column({nullable:true})
burst_point:string

@Column({nullable:true})
round_under_burst:string


@Column({nullable:true})
under_burst_length:string

@Column({nullable:true})
nipple_to_nipple:string

@Column({nullable:true})
half_length:string

@Column({nullable:true})
arm_hole:string

@Column({nullable:true})
sleve_short:string

@Column({nullable:true})
sleve_long:string

@Column({nullable:true})
sleve_3qtr:string

@Column({nullable:true})
Round_sleeve:string

@Column({nullable:true})
elbow:string

@Column({nullable:true})
heep:string

@Column({nullable:true})
heep_length:string

@Column({nullable:true})
flap:string

@Column({nullable:true})
waist:string

@Column({nullable:true})
blouse_length:string

@Column({nullable:true})
gown_length:string

@Column({nullable:true})
skirt_length:string

@Column({nullable:true})
knee_length:string

@Column({nullable:true})
trouser_length:string

@Column({nullable:true})
ankle:string

@Column({nullable:true})
thigh:string

@Column({nullable:true})
wrist:string

/// measurements for fresh sewn dresses for guys a some can also be gotten from
@Column({nullable:true})
chest:string

@Column({nullable:true})
shirt_length:string

@Column({nullable:true})
top_length:string

@Column({nullable:true})
back:string

@Column({nullable:true})
caps_ize:string



    //shoe info
    @Column({nullable:true})    
    shoe_size:string

    @Column({nullable:true})    
    alternative_shoe_size:string


    @Column({type:"enum", enum:ContractDuration,nullable:true})
    contractduration:ContractDuration

    @Column({nullable:true})
    pricerange: string 

    @Column({type:"boolean", default:true,nullable:true})
    negotiable:boolean

    @Column({nullable:true})
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel,nullable:true})
    kindofmodel:KindOfModel

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

    @OneToMany(()=>Comments,comment=>comment.model)
    comments:Comments[]

    @OneToMany(()=>Replies,reply=>reply.model)
    replies:Replies[]

    @OneToMany(()=>VendorPostsEntity,(vendorPost)=>vendorPost.creditedModel)
    vendorPosts:VendorPostsEntity[]

    // @OneToMany(()=> UserPostsEntity, (fd:UserPostsEntity)=>fd.owner)
    // posts:UserPostsEntity[]



    //a model can work for more than one fashiondesigner // multiple streams of income
  


    
}