import { Column, CreateDateColumn, Double, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../../Enums/roles.enum";
import { ContractDuration } from "../../../Enums/contractduration.enum";
import { PaymentPlan } from "../../../Enums/paymentoption.enum";
import { FashionDesignerPostsEntity } from "../../Posts/fd.post";
import { FashionDesignerEntity } from "../fashiodesigner.entity";
import { PhotographerEntity } from "../photographers.entity";
import { KindOfModel } from "../../../Enums/bradmodelstypes.enum";

@Entity()
export class SkincareModelsEntity{
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

//

    @Column({type:"enum", enum:ContractDuration})
    contractduration:ContractDuration

    @Column()
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column()
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel, default:KindOfModel.FOOTWEARS})
    kindofmodel:KindOfModel

    @Column({type:"enum", enum:PaymentPlan})
    paymentplan:PaymentPlan

    //a model can work for more than one fashiondesigner // multiple streams of income
    @OneToMany(()=>FashionDesignerEntity, (contractor:FashionDesignerEntity)=>contractor.brandmodels)
    contractor:FashionDesignerEntity[]

    @OneToMany(()=>PhotographerEntity,(photographer:PhotographerEntity)=>photographer.modelscontractedto)
    photographer:PhotographerEntity[]


    
}