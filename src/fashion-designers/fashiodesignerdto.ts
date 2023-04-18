import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateFashionDesignerDto{

    @IsString()
    @IsOptional()
    brandname:string 

    @IsString()
    @IsOptional()
    address:string 

    @IsString()
    @IsOptional()
    phone1:string 

    @IsString()
    @IsOptional()
    phone2:string 

    @IsString()
    @IsOptional()
    @MaxLength(300)
    bio:string 

    @IsString()
    @IsOptional()
    fashion_genre:string 

    @IsString()
    @IsOptional()
    digital_photo:string 



}