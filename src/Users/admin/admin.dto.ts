
// payment  
// like 


import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";





    


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