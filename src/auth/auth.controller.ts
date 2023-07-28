import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdultModelRegistrationDto, RegistrationDto, VendorRegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { Logindto } from './dto/logindto';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    @Post('signup/customer')
    async customersignup(@Body()dto:RegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.CustomerSignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }
        
    }

    @Post('signup/vendor')
    async Vendorsignup(@Body()dto:VendorRegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.VendorSignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }
        
    }

    @Post('signup/photographer')
    async Photographersignup(@Body()dto:RegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.PhotographerSignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }      
        
    }


    @Post('signup/kidmodel')
    async kidmodelsignup(@Body()dto:kidsModeleRegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.kidsmodelsignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }      
        
    }

    @Post('signup/adultmodel')
    async AdultModelsignup(@Body()dto:AdultModelRegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.Adultmodelsignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }      
        
    }

    @Post('signup/admin')
    async Adminsignup(@Body()dto:RegistrationDto):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.AdminSignup(dto)
            return {message:"welcome to ned fashion "}
        
            
        } catch (error) {
            throw error
            
        }      
        
    }

   


    @Post("login")
    async login(@Body()logindto:Logindto){
        return await this.authservice.login(logindto)
    }
}
