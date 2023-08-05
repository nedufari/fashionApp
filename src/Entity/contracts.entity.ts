import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"; 
import { ContractDuration, TypeOfContract } from "../Enums/contractDuration.enum";
import { vendorEntity } from "./Users/vendor.entity";
import { PhotographerEntity } from "./Users/photorapher.entity";
import { ModelEntity } from "./Users/model.entity";
import { IVendor } from "../Users/vendor/vendor.interface";
import { IPhotographer } from "../Users/photographers/photo.interface";
import { IModel } from "../Users/model/model.interface";


export interface IContract{
    id:string,
    commence_date:Date
    expiration_date:Date
    contract_duration:ContractDuration
    contract_worth:string
    contract_validity_number:string
    contract_duration_extension_offer:ContractDuration
    contract_worth_extension_offer:string
    contract_counter_offer_proposed:boolean
    vendor:string
    model:string
    photographer:string
    type_of_contract:TypeOfContract
}

export interface IContractPhotographerResponse{
    
    commence_date:Date
    expiration_date:Date
    contract_duration:ContractDuration
    contract_worth:string
    contract_validity_number:string
    vendor:string
    photographer:string
    type_of_contract:TypeOfContract
}

export interface IContractModelResponse{
    commence_date:Date
    expiration_date:Date
    contract_duration:ContractDuration
    contract_worth:string
    contract_validity_number:string
    vendor:string
    model:string
    type_of_contract:TypeOfContract
    
}




@Entity()
export class Contracts implements IContract{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"date",nullable:false})
    commence_date:Date

    @Column({type:"date",nullable:false})
    expiration_date:Date


    @Column({nullable:false,type:"enum", enum:ContractDuration})
    contract_duration:ContractDuration

    @Column({nullable:false,type:"enum", enum:TypeOfContract})
    type_of_contract:TypeOfContract

    @Column({nullable:false})
    contract_worth:string

    @Column({nullable:false})
    contract_validity_number:string

    @Column({nullable:true,type:"enum", enum:ContractDuration,})
    contract_duration_extension_offer:ContractDuration

    @Column({nullable:true})
    contract_worth_extension_offer:string

    @Column({type:'boolean',default:'false',nullable:true})
    contract_counter_offer_proposed:boolean

    @Column({type:'boolean',default:'false',nullable:true})
    contract_counter_offer_accepted:boolean

    @Column({type:'boolean',default:'false',nullable:true})
    is_terminated:boolean

    @Column({nullable:true})
    termination_reason:string

    @Column({nullable:true})
    message:string



   @Column({nullable:true})
    vendor:string

    @Column({nullable:true})
    photographer:string

    @Column({nullable:true})
    model:string

}