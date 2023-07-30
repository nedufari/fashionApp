import { Body, Controller, HttpStatus, Post, Res,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdultModelRegistrationDto, RegistrationDto, VendorRegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { Logindto } from './dto/logindto';
import { Response } from 'express';
import { JwtGuard } from './guards/jwt.guards';

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

   


    @Post("login/customer")
    async loginCustomer(@Body()logindto:Logindto){
        return await this.authservice.loginCustomer(logindto)
    }

    
    @Post("login/vendor")
    async loginVendor(@Body()logindto:Logindto){
        return await this.authservice.loginVendor(logindto)
    }

    
    @Post("login/photographer")
    async loginPhotographer(@Body()logindto:Logindto){
        return await this.authservice.loginPhotographer(logindto)
    }

    
    @Post("login/kidmodel")
    async loginKidModel(@Body()logindto:Logindto){
        return await this.authservice.loginKidModel(logindto)
    }

    
    @Post("login/adultmodel")
    async loginAdultModel(@Body()logindto:Logindto){
        return await this.authservice.loginAdultModel(logindto)
    }

    
    @Post("login/admin")
    async loginAdmin(@Body()logindto:Logindto){
        return await this.authservice.loginAdmmin(logindto)
    }

    //sign out of log out a user 
    @UseGuards(JwtGuard)
    @Post('/logout')
    async logout(@Res() response: Response): Promise<void> {
      // Clear the access token from the client's storage
      response.clearCookie('access_token', {
        // Set any additional options for the cookie, such as domain, path, etc.
        // Here, we're setting the 'expires' option to a past date to invalidate the cookie.
        expires: new Date(0),
        httpOnly: true, // Make the cookie accessible only through HTTP(S) requests, not client-side scripts
        // Other cookie options...
      });// If you're using cookies for the token, use the correct cookie name
  
      // Alternatively, you can remove the token from local storage or any other storage mechanism on the client-side
  
      // Respond with a success message
      response.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    }
  }

