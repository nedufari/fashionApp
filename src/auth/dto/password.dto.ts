import { IsNotEmpty, IsString, Matches, Validate, isStrongPassword } from "class-validator"

export class ChangePasswordDto{


    @IsString()
    @IsNotEmpty()
    oldPassword:string 

    @IsString()
    @IsNotEmpty()
    newpassword:string
    
    @IsString()
    @IsNotEmpty()
    @Validate((value,args)=>value===args.object.password,{message:"confirm password must match password field"})
    confirmPassword:string 
}

export class SendPasswordResetLinkDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

}

export class FinallyResetPasswordDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

    @IsString()
    @IsNotEmpty()
    resetlink:string 

    @IsString()
    @IsNotEmpty()
    password:string 

    @IsString()
    @IsNotEmpty()
    @Validate((value,args)=>value===args.object.password,{message:"confirm password must match password field"})
    confirmPassword:string 

}