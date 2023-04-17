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

    @Column({length: 10,nullable:false})
    password:string

    @Column()
    fullname:string

    @Column()
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.FASHION_MODELS})
    role:Roles

    @Column({length:11})
    phone1:string

    @Column({length:11})
    phone2:string

    @Column({length:300})
    bio:string

    @Column({length:2})
    age:string

    @Column()
    gender:string

    @Column()
    state_of_residence:string

    @Column()
    complexion:string 

    @Column()
    height_in_ft:string

    @Column()
    weight_in_kg:string

    @CreateDateColumn()
    cratedDate:Date

// social media handle 
    @Column()
    facebook:string

    @Column()
    instagram:string

    @Column()
    twitter:string

    @Column()
    tiktok:string

    @Column()
    snapchat:string



/// entities about dress sizes for already sewn dresses not double(eve numbers only )
    @Column()
    gown_size:number

    @Column()
    blouse_size:number

    @Column()
    skirt_size:number

    @Column()
    trouser_size:number

    @Column()
    shirt_size:number

    @Column()
    hat_size:string

/// measurements for fresh sewn dresses for ladies

    @Column()
    shoulder:string

    @Column()
    burst:string

    @Column()
    burst_point:string

    @Column()
    round_under_burst:string


    @Column()
    under_burst_length:string

    @Column()
    nipple_to_nipple:string

    @Column()
    half_length:string

    @Column()
    arm_hole:string

    @Column()
    sleve_short:string

    @Column()
    sleve_long:string

    @Column()
    sleve_3qtr:string

    @Column()
    Round_sleeve:string

    @Column()
    elbow:string

    @Column()
    heep:string

    @Column()
    heep_length:string

    @Column()
    flap:string

    @Column()
    waist:string

    @Column()
    blouse_length:string

    @Column()
    gown_length:string

    @Column()
    skirt_length:string

    @Column()
    knee_length:string

    @Column()
    trouser_length:string

    @Column()
    ankle:string

    @Column()
    thigh:string

    @Column()
    wrist:string

    /// measurements for fresh sewn dresses for guys a some can also be gotten from
    @Column()
    chest:string

    @Column()
    shirt_length:string

    @Column()
    top_length:string

    @Column()
    back:string

    @Column()
    caps_ize:string

   


    @Column({type:"enum", enum:ContractDuration})
    contractduration:ContractDuration

    @Column()
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column()
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel, default:KindOfModel.FASHION_WEARS})
    kindofmodel=KindOfModel

    @Column({type:"enum", enum:PaymentPlan})
    paymentplan:PaymentPlan

    //a model can work for more than one fashiondesigner // multiple streams of income
    @OneToMany(()=>FashionDesignerEntity, (contractor:FashionDesignerEntity)=>contractor.brandmodels)
    @JoinColumn()
    contractor:FashionDesignerEntity[]

    @OneToMany(()=>PhotographerEntity,(photographer:PhotographerEntity)=>photographer.modelscontractedto)
    @JoinColumn()
    photographer:PhotographerEntity[]


    
}