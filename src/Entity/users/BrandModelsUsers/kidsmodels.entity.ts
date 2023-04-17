import { Column, CreateDateColumn, Double, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../../Enums/roles.enum";
import { ContractDuration } from "../../../Enums/contractduration.enum";
import { PaymentPlan } from "../../../Enums/paymentoption.enum";
import { FashionDesignerPostsEntity } from "../../Posts/fd.post";
import { FashionDesignerEntity } from "../fashiodesigner.entity";
import { PhotographerEntity } from "../photographers.entity";
import { KindOfModel } from "../../../Enums/bradmodelstypes.enum";

@Entity()
export class KidsModelsEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true})
    email:string

    @Column({unique:true,})
    username:string 

    @Column({length: 10})
    password:string

    @Column()
    fullname:string

    //parents either dad or mum or guardian 
    @Column()
    manager:string

    @Column()
    address:string

    @Column({type:"enum", enum:Roles, default:Roles.FASHION_MODELS})
    role:Roles

    @Column({length:11})
    phone1:string

    @Column({length:11})
    ManagerPhone:string

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

    @Column({type:"boolean",default:false})
    on_low_cut:boolean

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

//maager social media handle 
    @Column()
    Managerfacebook:string

    @Column()
    Managerinstagram:string

    @Column()
    Managertwitter:string



/// entities about dress sizes for already sewn dresses 
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

/// measurements for fresh sewn dresses

    @Column()
    shirt_length:string

    @Column()
    top_length:string

    @Column()
    caps_ize:string

    @Column()
    shoulder:string

    @Column()
    chest:string

    @Column()
    half_length:string

    @Column()
    sleve_short:string

    @Column()
    sleve_long:string

    @Column()
    sleve_3qtr:string

    @Column()
    Round_sleeve:string




    //shoe info
    @Column()    
    shoe_size:number

    @Column()    
    alternative_shoe_size:number


    @Column({type:"enum", enum:ContractDuration})
    contractduration:ContractDuration

    @Column()
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column()
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel, default:KindOfModel.KID})
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