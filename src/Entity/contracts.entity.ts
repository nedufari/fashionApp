import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration } from "../Enums/contractDuration.enum";

@Entity()
export class Contracts{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"date",nullable:false})
    commence_date:Date

    @Column({type:"date",nullable:false})
    expiration_date:Date


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    contract_duration:ContractDuration

    @Column({nullable:false})
    contract_worth:string

    // @ManyToOne(()=>FashionDesignerEntity,(contractor:FashionDesignerEntity)=>contractor.brandname)
    // fashion_mogul:FashionDesignerEntity

}