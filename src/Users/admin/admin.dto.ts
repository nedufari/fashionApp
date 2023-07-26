
// payment  
// like 


import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { CutomerUpgrade, Roles } from "../../Enums/roles.enum";
import { VendorUpdatePostDto } from "../vendor/vendor.dto";
import { UpdateModelDataDto } from "../model/model.dto";
import { UpdatePhotographerDataDto } from "../photographers/photo.dto";




    


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
export class UpdateAdminDataDto{



    @IsString()
    @IsOptional()
    digital_photo:string 

    @IsString()
    @IsOptional()
    username:string 

    @IsString()
    @IsOptional()
    gender:string 

    @IsString()
    @IsOptional()
    fullname:string 

 
}