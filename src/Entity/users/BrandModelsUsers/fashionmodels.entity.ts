import { Column, CreateDateColumn, Double, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../../Enums/roles.enum";
import { ContractDuration } from "../../../Enums/contractduration.enum";
import { PaymentPlan } from "../../../Enums/paymentoption.enum";
import { FashionDesignerPostsEntity } from "../../Posts/fd.post";
import { FashionDesignerEntity } from "../fashiodesigner.entity";
import { PhotographerEntity } from "../photographers.entity";
import { KindOfModel } from "../../../Enums/bradmodelstypes.enum";

@Entity()
export class FashionModelsEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true,nullable:false})
    email:string

    @Column({unique:true,})
    username:string 

    @Column({nullable:false})
    password:string

    @Column({nullable:true})
    fullname:string

    @Column({nullable:true})
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.FASHION_MODELS})
    role:Roles

    @Column({length:11,nullable:true})
    phone1:string

    @Column({length:11,nullable:true})
    phone2:string

    @Column({length:300,nullable:true})
    bio:string

    @Column({nullable:true})
    age:string

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



/// entities about dress sizes for already sewn dresses not double(eve numbers only )
    @Column({nullable:true})
    gown_size:number

    @Column({nullable:true})
    blouse_size:number

    @Column({nullable:true})
    skirt_size:number

    @Column({nullable:true})
    trouser_size:number

    @Column({nullable:true})
    shirt_size:number

    @Column({nullable:true})
    hat_size:string

/// measurements for fresh sewn dresses for ladies

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

   


    @Column({type:"enum", enum:ContractDuration,nullable:true})
    contractduration:ContractDuration

    @Column({nullable:true})
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column({nullable:true})
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel, default:KindOfModel.FASHION_WEARS})
    kindofmodel=KindOfModel

    @Column({type:"enum", enum:PaymentPlan,nullable:true})
    paymentplan:PaymentPlan

    //a model can work for more than one fashiondesigner // multiple streams of income
    @OneToMany(()=>FashionDesignerEntity, (contractor:FashionDesignerEntity)=>contractor.brandmodels)
    @JoinColumn()
    contractor:FashionDesignerEntity[]

    @OneToMany(()=>PhotographerEntity,(photographer:PhotographerEntity)=>photographer.modelscontractedto)
    @JoinColumn()
    photographer:PhotographerEntity[]


    
}