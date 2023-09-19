
// payment  
// like 


import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { AdminTypes, ClearanceLevels } from "../../Enums/roles.enum";
import { ComplaintResolutionLevel } from "../../Enums/complaint.enum";



//create admin dto 
export class CreateAdminDto{
    @IsEnum(AdminTypes)
    @IsNotEmpty()
    admintype:AdminTypes

    @IsEnum(ClearanceLevels)
    @IsNotEmpty()
    clearanceLevel:ClearanceLevels

    @IsEmail()
    @IsNotEmpty()
    email:string
}

export class UpgradeClearanceLevelDto{
    @IsEnum(ClearanceLevels)
    @IsOptional()
    clearanceLevel:ClearanceLevels

}

export class ChangeAdmintypeDto{
    @IsEnum(AdminTypes)
    @IsOptional()
    admintype:AdminTypes
    

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

export class VerifyAccountDto{
    @IsBoolean({message:"the account must be verified else once the user logs out the user wont be allowed to log in back "})
    isVerified:boolean
}

export class SendEmailToUsersDto{
    @IsString()
    subject:string | any

    @IsString()
    content:string | any 


}

export class ResolveComplaintDto{
    @IsEnum(ComplaintResolutionLevel)
    isResolved:ComplaintResolutionLevel

    @IsString()
    response:string

    @IsString()
    title:string
}