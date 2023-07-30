import { IsBoolean, IsEnum, IsString } from "class-validator";
import { ContractDuration } from "../Enums/contractDuration.enum";

export class ContractDto{
    

    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    contract_duration:ContractDuration

}


export class ExtendContractDto{
    

    @IsString()
    extended_contract_worth_offer:string

    @IsEnum(ContractDuration)
    extended_contract_duration_offer:ContractDuration

}

export class AcceptContractofferDto{
    @IsBoolean({message:"you must accept or decline the offer"})
    isAccepted:boolean
}

export class CounterOfferDto{
    @IsEnum(ContractDuration)
    counter_duration:ContractDuration

    @IsString()
    counter_worth:string

    @IsString()
    message:string
    
}