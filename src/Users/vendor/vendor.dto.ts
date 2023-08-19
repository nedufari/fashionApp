
// payment 
 
// update post 
// like 


import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { KindOfModel } from "../../Enums/modelType.enum";
import { PaymentPlan } from "../../Enums/paymentOption.enum";
import { ContractDuration } from "../../Enums/contract.enum";
import { Availability } from "../../Enums/post.enum";
import { Interests, Niche4Vendors } from "../../Enums/niche.enum";

// contract 
export class VendorContractWithModel{
    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    @IsNotEmpty({message:'the contract duration must be stated for it to be a valid contract '})
    contract_duration:ContractDuration

    @IsString()
    @IsNotEmpty({message:'please enter the VendorID given to you when you signed up as a Vendor on the platform. this is to ensure that you are the rightful owner of this account and also ensures that you are in consent of the contract signature'})
    vendorID:string
}
// contract 
export class VendorContractWithPhotographer{
    @IsString()
    contract_worth:string

    @IsEnum(ContractDuration)
    @IsNotEmpty({message:'the contract duration must be stated for it to be a valid contract '})
    contract_duration:ContractDuration
}

// post
export class VendorMakePostDto{
    @IsString()
    @IsNotEmpty()
    caption:string

    @IsArray()
    @IsOptional({ message: 'you can either post a video file or any amount of predefined images' })
    media: string[];

    @IsString()
    @IsNotEmpty()
    cost:string

    @IsEnum(Availability)
    availability:Availability

    @IsString()
    @IsNotEmpty()
    cvnmodel: string
    
    @IsString()
    @IsNotEmpty()
    cvnphotographer: string

}

// update post
export class VendorUpdatePostDto{
    @IsString()
    @IsOptional()
    caption:string

    @IsArray()
    @IsOptional({ message: 'you can either post a video file or any amount of predefined images' })
    media: string[];

}
// passowrd change
export class VendorChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    password:string
}

// comment 
export class VendorMakeCommentDto{
    @IsString()
    @IsNotEmpty()
    comment:string
}
// reply
export class VendorReplyDto{
    @IsString()
    @IsNotEmpty()
    reply:string
}


// update user Data
export class UpdateVendorDataDto{

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
}

export class AddLinesDto {
    @IsEnum(Interests, { each: true }) // Validate each enum value in the array
    @ArrayNotEmpty() // Ensure the array is not empty
    lines: Interests[];

}