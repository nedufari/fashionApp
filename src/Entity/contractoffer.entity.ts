import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration, ContractOfferStatus, TypeOfContract } from "../Enums/contract.enum";



export interface IContractOffer{
    id:string,
    contract_duration:ContractDuration
    contract_worth:string
    contract_offer_id:string
    sent_at:Date
    vendor:string
    model?:string
    photographer?:string
    type_of_contract:TypeOfContract
    status:ContractOfferStatus
}

export interface IContractOfferPhotographerResponse{
    
    contract_duration:ContractDuration
    contract_worth:string
    contract_offer_id:string
    sent_at:Date
    vendor:string
    photographer:string
    type_of_contract:TypeOfContract
    status:ContractOfferStatus
}

export interface IContractOfferModelResponse{
    contract_duration:ContractDuration
    contract_worth:string
    contract_offer_id:string
    sent_at:Date
    vendor:string
    model:string
    type_of_contract:TypeOfContract
    status:ContractOfferStatus
    
}




@Entity()
export class ContractsOfffer implements IContractOffer{
    @PrimaryGeneratedColumn("uuid")
    id:string


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    contract_duration:ContractDuration

    @Column({nullable:false,type:"enum", enum:TypeOfContract})
    type_of_contract:TypeOfContract

    @Column({nullable:false})
    contract_worth:string

    @Column({nullable:false})
    contract_offer_id:string

    @Column({nullable:false,type:"enum", enum:ContractOfferStatus})
    status:ContractOfferStatus

    @CreateDateColumn()
    sent_at:Date

   @Column({nullable:true})
    vendor:string

    @Column({nullable:true})
    photographer?:string

    @Column({nullable:true})
    model?:string

    @Column({nullable:true,type:"boolean"})
    isAccepted:boolean //declined or not 


    @Column({nullable:true,type:"boolean"})
    isCountered:boolean //sent a counter ofer 

}