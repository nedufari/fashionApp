import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AdminTypes } from "../../Enums/roles.enum";

export class Logindto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsEnum(AdminTypes)
    @IsNotEmpty({message:'please selct the admin type'})
    adminType:AdminTypes
}

export class AdminLogindto{
    @IsString()
    @IsNotEmpty()
    adminID:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsEnum(AdminTypes)
    @IsNotEmpty({message:'please selct the admin type'})
    adminType:AdminTypes
}

export class VerifyOtpdto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    otp:string
}



