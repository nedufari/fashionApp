import { IsNotEmpty, IsString,  IsStrongPassword,  Validate, isStrongPassword } from "class-validator"
import { Match } from "../../match.decorator"

export class ChangePasswordDto{


    @IsString()
    @IsNotEmpty()
    oldPassword:string 

    @IsString()
    @IsNotEmpty()
    newpassword:string
    
    @IsString()
    @IsNotEmpty()
    @Match('newpassword', { message: 'Confirmation password does not match the new password.' })
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
    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    password:string 

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Confirmation password does not match the new password.' })
    confirmPassword:string 

}