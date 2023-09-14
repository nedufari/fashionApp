import { IsEmail, IsNotEmpty, IsString,IsNumber, IsEnum, IsStrongPassword } from "class-validator"
import{} from "class-transformer"
import { AdminTypes, ClearanceLevels, Roles } from "../../Enums/roles.enum"
import { KindOfModel } from "../../Enums/modelType.enum"
import { Match } from "../../match.decorator"

export class AdminRegistrationDto{
    //used by all models and photographer
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
    password:string

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Confirmation password does not match the new password.' })
    confirmPassword:string 

    @IsString()
    @IsNotEmpty()
    username:string

}

export class RegistrationDto{
    //used by all models and photographer
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
    password:string

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Confirmation password does not match the new password.' })
    confirmPassword:string 

    @IsString()
    @IsNotEmpty()
    username:string
}

export class AdultModelRegistrationDto{
    //used by all models and photographer
    @IsEmail()
    @IsNotEmpty()
    email:string

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

    @IsString()
    @IsNotEmpty()
    username:string

    @IsEnum(KindOfModel)
    @IsNotEmpty({message:'you must selcet the kind of model you are registering as'})
    kindofmodel:KindOfModel
}

export class VendorRegistrationDto{
    //used by all models and photographer
    @IsEmail()
    @IsNotEmpty()
    email:string

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

    @IsString()
    @IsNotEmpty()
    brandname:string
}


export class kidsModeleRegistrationDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

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

    @IsString()
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @IsNumber()
    age:number

    @IsString()
    @IsNotEmpty()
    gender:string

    @IsString()
    @IsNotEmpty()
    manager:string

    @IsString()
    @IsNotEmpty()
    ManagerPhone:string

    @IsEnum(KindOfModel)
    @IsNotEmpty({message:'you must selcet the kind of model you are registering as'})
    kindofmodel:KindOfModel




}

export class RequestOtpResendDto {
    @IsEmail()
    email: string;

    // @IsEnum(Roles)
    // role:Roles
  }

