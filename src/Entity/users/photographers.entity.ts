import { Column, Entity, Generated, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../Enums/roles.enum";
import { ContractDuration } from "../../Enums/contractduration.enum";
import { PaymentPlan } from "../../Enums/paymentoption.enum";
import { FashionDesignerEntity } from "./fashiodesigner.entity";
import { FashionModelsEntity } from "./BrandModelsUsers/fashionmodels.entity";

@Entity()
export class PhotographerEntity{
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

    @Column({type:"enum", enum:Roles, default:Roles.PHOTOGRAPHERS})
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

    @Column({type:"enum", enum:ContractDuration,nullable:true})
    contractduration:ContractDuration

    @Column({nullable:true})
    pricerange: string 

    @Column({type:"boolean", default:true,nullable:true})
    negotiable:boolean

    @Column({nullable:true})
    displayPicture:string

    @Column({type:"enum", enum:PaymentPlan,nullable:true})
    paymentplan:PaymentPlan

    //relationship between the fashiondesigner and the photographer , a photographer can have many designers 
    @OneToMany(()=>FashionDesignerEntity,(contractor:FashionDesignerEntity)=>contractor.photographer)
    contractor : FashionDesignerEntity[]

    @OneToMany(()=>FashionModelsEntity,(model:FashionModelsEntity)=>model.photographer)
    modelscontractedto : FashionDesignerEntity[]







    
    
}