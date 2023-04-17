import { IsEmail, IsNotEmpty, IsString,IsNumber } from "class-validator"
import{} from "class-transformer"

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

export class UserRegistrationDto{
    //used by the fashion designer and the ordinary user
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsString()
    @IsNotEmpty()
    name:string

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

