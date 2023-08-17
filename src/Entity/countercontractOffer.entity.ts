import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration, ContractOfferStatus, TypeOfContract } from "../Enums/contractDuration.enum";



export interface ICounterContractOffer{
    id:string,
    contract_duration:ContractDuration
    contract_worth:string
    contract_counteroffer_id:string
    status:ContractOfferStatus
    sent_at:Date
    vendor:string
    model?:string
    photographer?:string
    type_of_contract:TypeOfContract
}

export interface ICounterContractOfferPhotographerResponse{
    
    contract_duration:ContractDuration
    contract_worth:string
    contract_counteroffer_id:string
    status:ContractOfferStatus
    sent_at:Date
    vendor:string
    photographer:string
    type_of_contract:TypeOfContract
}

export interface IcounterContractOfferModelResponse{
    contract_duration:ContractDuration
    contract_worth:string
    contract_counteroffer_id:string
    status:ContractOfferStatus
    sent_at:Date
    vendor:string
    model:string
    type_of_contract:TypeOfContract
    
}




@Entity()
export class CounterContractsOfffer implements ICounterContractOffer{
    @PrimaryGeneratedColumn("uuid")
    id:string


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    contract_duration:ContractDuration

    @Column({nullable:false,type:"enum", enum:TypeOfContract})
    type_of_contract:TypeOfContract

    @Column({nullable:false})
    contract_worth:string

    @Column({nullable:false})
    message:string

    @Column({nullable:false})
    contract_counteroffer_id:string

    @Column({nullable:false,type:"enum", enum:ContractOfferStatus})
    status:ContractOfferStatus

    @CreateDateColumn()
    sent_at:Date

   @Column({nullable:false})
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