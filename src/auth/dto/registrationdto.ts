import { IsEmail, IsNotEmpty, IsString,IsNumber, IsEnum } from "class-validator"
import{} from "class-transformer"
import { Roles } from "../../Enums/roles.enum"
import { KindOfModel } from "../../Enums/modelType.enum"

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

export class AdultModelRegistrationDto{
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
    password:string

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

    @IsEnum(KindOfModel)
    @IsNotEmpty({message:'you must selcet the kind of model you are registering as'})
    kindofmodel:KindOfModel




}

