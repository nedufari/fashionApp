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

    @Column({type:"enum", enum:Roles, default:Roles.PHOTOGRAPHERS})
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

    @Column({type:"enum", enum:ContractDuration})
    contractduration:ContractDuration

    @Column()
    pricerange: string 

    @Column({type:"boolean", default:true})
    negotiable:boolean

    @Column()
    displayPicture:string

    @Column({type:"enum", enum:PaymentPlan})
    paymentplan:PaymentPlan

    //relationship between the fashiondesigner and the photographer , a photographer can have many designers 
    @OneToMany(()=>FashionDesignerEntity,(contractor:FashionDesignerEntity)=>contractor.photographer)
    contractor : FashionDesignerEntity[]

    @OneToMany(()=>FashionModelsEntity,(model:FashionModelsEntity)=>model.photographer)
    modelscontractedto : FashionDesignerEntity[]







    
    
}