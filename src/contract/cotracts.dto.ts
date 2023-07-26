import { IsEnum, IsString } from "class-validator";
import { ContractDuration } from "../Enums/contractDuration.enum";

export class ContractDto{
    

    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    contract_duration:ContractDuration
    

}