import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { complaintsType } from "../Enums/complaint.enum";

export class ContractComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsNotEmpty()
    cvn:string 

    @IsString()
    @IsNotEmpty()
    issue:string
}

export class PaymentComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsNotEmpty()
    reciept_number:string 

    @IsString()
    @IsNotEmpty()
    issue:string
}

export class OrderComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsNotEmpty()
    tracking_number:string 

    @IsString()
    @IsNotEmpty()
    issue:string
}

export class WalletComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsNotEmpty()
    walletID:string 

    @IsString()
    @IsNotEmpty()
    issue:string
}

export class AbuseComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsNotEmpty()
    pictorial_proof:string 

    @IsString()
    @IsNotEmpty()
    issue:string
}

export class OtherComplaintDto{

    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType


    @IsString()
    @IsNotEmpty()
    issue:string
}


export class ComplaintDto{

    
    @IsOptional()
    walletIssue:WalletComplaintDto

    @IsOptional()
    abuseIssue:AbuseComplaintDto

    @IsOptional()
    orderIssue:OrderComplaintDto

    @IsOptional()
    contractIssue:ContractComplaintDto

    @IsOptional()
    payment:PaymentComplaintDto

    @IsOptional()
    otherIssue:OtherComplaintDto

   
}

export class  LayComplaintDto{
    @IsEnum(complaintsType)
    @IsNotEmpty()
    complaint_type:complaintsType

    @IsString()
    @IsOptional()
    issue:string


    @IsString()
    @IsOptional()
    walletID:string 

    @IsString()
    @IsOptional()
    tracking_number:string 

    @IsString()
    @IsOptional()
    reciept_number:string 

    @IsString()
    @IsOptional()
    cvn:string 


}



