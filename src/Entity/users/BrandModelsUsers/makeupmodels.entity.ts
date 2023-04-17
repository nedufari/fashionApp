import { Column, CreateDateColumn, Double, Entity, Generated, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../../Enums/roles.enum";
import { ContractDuration } from "../../../Enums/contractduration.enum";
import { PaymentPlan } from "../../../Enums/paymentoption.enum";
import { FashionDesignerPostsEntity } from "../../Posts/fd.post";
import { FashionDesignerEntity } from "../fashiodesigner.entity";
import { PhotographerEntity } from "../photographers.entity";
import { KindOfModel } from "../../../Enums/bradmodelstypes.enum";

@Entity()
export class MakeUpModelsEntity{
    @PrimaryGeneratedColumn("uuid")
    id :string

    @Column({unique:true,nullable:false})
    email:string

    @Column({unique:true,nullable:false})
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

    @Column({type:"boolean",default:false,nullable:true})
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

//

    @Column({type:"enum", enum:ContractDuration,nullable:true})
    contractduration:ContractDuration

    @Column({nullable:true})
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column({nullable:true})
    displayPicture:string

    @Column({type:"enum", enum:KindOfModel, default:KindOfModel.MAKEUP})
    kindofmodel:KindOfModel

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