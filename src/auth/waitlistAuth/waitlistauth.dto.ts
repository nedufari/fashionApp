import { IsDateString, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class WaitlistModeleRegistrationDto{
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
    username:string

    @IsNotEmpty()
    @IsDateString()
    dob:string
    
    manager?:string
    managerPhone?:string

}

export class WaitlistVendorRegistrationDto{
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
    brandname:string

   

}

export class WaitlistPhotographerRegistrationDto{
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
    username:string

   

}