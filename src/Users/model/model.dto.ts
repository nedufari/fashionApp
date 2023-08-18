
// payment 
// post 
// update post 

// like 


import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { KindOfModel } from "../../Enums/modelType.enum";
import { PaymentPlan } from "../../Enums/paymentOption.enum";
import { ContractDuration } from "../../Enums/contract.enum";

// passowrd change
export class ChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    password:string
}

// post
export class ModelMakePostDto{
    @IsString()
    @IsNotEmpty()
    caption:string

    @IsString()
    @IsOptional({message:'you can either post a video file or any amount of predefined images '})
    media:string
}

// update post
export class ModelUpdatePostDto{
    @IsString()
    @IsOptional()
    caption:string

    @IsString()
    @IsOptional({message:'you can either post a video file or any amount of predefined images '})
    media:string
}


// contract 
export class ModelContractWithVendor{
    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    @IsNotEmpty({message:'the contract duration must be stated for it to be a valid contract '})
    contract_duration:ContractDuration

    @IsString()
    @IsNotEmpty({message:'please enter the ModelID given to you when you signed up as a model on the platform. this is to ensure that you are the rightful owner of this account and also ensures that you are in consent of the contract signature'})
    modelID:string
}


// comment 
export class MakeCommentDto{
    @IsString()
    @IsNotEmpty()
    comment:string
}
// reply
export class ReplyDto{
    @IsString()
    @IsNotEmpty()
    reply:string
}



// update user Data
export class UpdateModelDataDto{

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
    fashion_genre:string 

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

    @IsBoolean()
    @IsOptional()
    on_low_cut:boolean

    @IsString()
    @IsOptional()
    state_of_residence:string 

    @IsString()
    @IsOptional()
    height_in_ft:string 

    @IsString()
    @IsOptional()
    weight_in_kg:string 

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
    Managerfacebook:string

    @IsString()
    @IsOptional()
    Managerinstagram:string

    @IsString()
    @IsOptional()
    Managertwitter:string


    @IsString()
    @IsOptional()
    gown_size:string

    @IsString()
    @IsOptional()
    blouse_size:string

    @IsString()
    @IsOptional()
    skirt_size:string

    @IsString()
    @IsOptional()
    trouser_size:string

    @IsString()
    @IsOptional()
    shirt_size:string

    @IsString()
    @IsOptional()
    hat_size:string

   

/// measurements for fresh sewn dresses

    @IsString()
    @IsOptional()
    shoulder:string

    @IsString()
    @IsOptional()
    burst:string

    @IsString()
    @IsOptional()
    burst_point:string

    @IsString()
    @IsOptional()
    round_under_burst:string


    @IsString()
    @IsOptional()
    under_burst_length:string

    @IsString()
    @IsOptional()
    nipple_to_nipple:string

    @IsString()
    @IsOptional()
    half_length:string

    @IsString()
    @IsOptional()
    arm_hole:string

    @IsString()
    @IsOptional()
    sleve_short:string

    @IsString()
    @IsOptional()
    sleve_long:string

    @IsString()
    @IsOptional()
    sleve_3qtr:string

    @IsString()
    @IsOptional()
    Round_sleeve:string

    @IsString()
    @IsOptional()
    elbow:string

    @IsString()
    @IsOptional()
    heep:string

    @IsString()
    @IsOptional()
    heep_length:string

    @IsString()
    @IsOptional()
    flap:string

    @IsString()
    @IsOptional()
    waist:string

    @IsString()
    @IsOptional()
    blouse_length:string

    @IsString()
    @IsOptional()
    gown_length:string

    @IsString()
    @IsOptional()
    skirt_length:string

    @IsString()
    @IsOptional()
    knee_length:string

    @IsString()
    @IsOptional()
    trouser_length:string

    @IsString()
    @IsOptional()
    ankle:string

    @IsString()
    @IsOptional()
    thigh:string

    @IsString()
    @IsOptional()
    wrist:string

/// measurements for fresh sewn dresses for guys a some can also be gotten from
    @IsString()
    @IsOptional()
    chest:string

    @IsString()
    @IsOptional()
    shirt_length:string

    @IsString()
    @IsOptional()
    top_length:string

    @IsString()
    @IsOptional()
    back:string

    @IsString()
    @IsOptional()
    caps_ize:string



    //shoe info
    @IsString()
    @IsOptional()   
    shoe_size:string

    @IsString()
    @IsOptional()   
    alternative_shoe_size:string


    @IsString()
    @IsOptional()
    pricerange: string 

    @IsBoolean()
    @IsNotEmpty({message:'you must indicate if you are open for negotiation of your price range '})
    negotiable:boolean

    @IsString()
    @IsOptional()
    displayPicture:string

    @IsEnum(KindOfModel)
    @IsNotEmpty({message:'please select the kind of model you are'})
    kindofmodel:KindOfModel

    @IsEnum(PaymentPlan)
    @IsNotEmpty({message:'please select your payment structure preference '})
    paymentplan:PaymentPlan





}