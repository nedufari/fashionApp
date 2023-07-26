
// payment 
// update post 
// like 


import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { PaymentPlan } from "../../Enums/paymentOption.enum";
import { ContractDuration } from "../../Enums/contractDuration.enum";

// contract 
export class PhotographerContractWithVendor{
    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    @IsNotEmpty({message:'the contract duration must be stated for it to be a valid contract '})
    contract_duration:ContractDuration

    @IsString()
    @IsNotEmpty({message:'please enter the PhotographerID given to you when you signed up as a Photographer on the platform. this is to ensure that you are the rightful owner of this account and also ensures that you are in consent of the contract signature'})
    PhotographerID:string
}


// post
export class PhotographerMakePostDto{
    @IsString()
    @IsNotEmpty()
    caption:string

    @IsString()
    @IsOptional({message:'you can either post a video file or any amount of predefined images '})
    media:string
}

// update post
export class PhotographerUpdatePostDto{
    @IsString()
    @IsOptional()
    caption:string

    @IsString()
    @IsOptional({message:'you can either post a video file or any amount of predefined images '})
    media:string
}



// passowrd change
export class PhotographerChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    password:string
}

// comment 
export class PhotographerMakeCommentDto{
    @IsString()
    @IsNotEmpty()
    comment:string
}
// reply
export class PhotographerReplyDto{
    @IsString()
    @IsNotEmpty()
    reply:string
}


// update user Data
export class UpdatePhotographerDataDto{

    @IsString()
    @IsOptional()
    brandname:string 

    @IsString()
    @IsOptional()
    address:string 

    @IsString()
    @IsOptional()
    phone1:string 

    @IsString()
    @IsOptional()
    phone2:string 

    @IsString()
    @IsOptional()
    @MaxLength(300)
    bio:string 

    

    @IsString()
    @IsOptional()
    digital_photo:string 

    @IsNumber()
    @IsOptional()
    age:number

    @IsString()
    @IsOptional()
    gender:string 

    @IsString()
    @IsOptional()
    complexion:string 


    @IsString()
    @IsOptional()
    facebook:string 

    @IsString()
    @IsOptional()
    twitter:string

    @IsString()
    @IsOptional()
    thread:string

    @IsString()
    @IsOptional()
    instagram:string

    @IsString()
    @IsOptional()
    tiktok:string

    @IsString()
    @IsOptional()
    snapchat:string

    
    @IsString()
    @IsOptional()
    pricerange: string 

    @IsBoolean()
    @IsNotEmpty({message:'you must indicate if you are open for negotiation of your price range '})
    negotiable:boolean

    @IsEnum(PaymentPlan)
    @IsNotEmpty({message:'please select your payment structure preference '})
    paymentplan:PaymentPlan
}