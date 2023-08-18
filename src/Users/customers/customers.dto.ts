
// payment  
// like 
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { CutomerUpgrade, Roles } from "../../Enums/roles.enum";
import { VendorUpdatePostDto } from "../vendor/vendor.dto";
import { UpdateModelDataDto } from "../model/model.dto";
import { UpdatePhotographerDataDto } from "../photographers/photo.dto";
import { LikeAction } from "../../Enums/post.enum";


//upgrade to a model 
export class UpgradeToVendor{
    @IsEnum(CutomerUpgrade)
    @IsNotEmpty({message:'please select the kind of role you want to upgrade to '})
    role=CutomerUpgrade.VENDOR
    data:VendorUpdatePostDto

}

export class LikeDto{
    @IsEnum(LikeAction)
    action:LikeAction
}
//upgrade to a model 
export class UpgradeToModel{
    @IsEnum(CutomerUpgrade)
    @IsNotEmpty({message:'please select the kind of role you want to upgrade to '})
    role=CutomerUpgrade.MODEL
    data:UpdateModelDataDto

}

//upgrade to a photographer 
export class UpgradeToPhotographer{
    @IsEnum(CutomerUpgrade)
    @IsNotEmpty({message:'please select the kind of role you want to upgrade to '})
    role=CutomerUpgrade.PHOTOGRAPHER
    data:UpdatePhotographerDataDto

}

    


// passowrd change
export class CustomerChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    password:string
}

// comment 
export class CustomerMakeCommentDto{
    @IsString()
    @IsNotEmpty()
    comment:string
}
// reply
export class CustomerReplyDto{
    @IsString()
    @IsNotEmpty()
    reply:string
}


// update user Data
export class UpdateCustomerDataDto{

  
    @IsString()
    @IsOptional()
    address:string 

    @IsString()
    @IsOptional()
    phone1:string 


    @IsString()
    @IsOptional()
    @MaxLength(300)
    bio:string 


    @IsString()
    @IsOptional()
    digital_photo:string 

    @IsString()
    @IsOptional()
    username:string 

    @IsString()
    @IsOptional()
    gender:string 

 
}

