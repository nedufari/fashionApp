import { IsEmail, IsNotEmpty, IsString,IsNumber, IsEnum } from "class-validator"
import{} from "class-transformer"
import { Roles } from "../../Enums/roles.enum"

export class RegistrationDto{
    //used by all models and photographer
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsString()
    @IsNotEmpty()
    username:string
}


export class kidsModeleRegistrationDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

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




}

