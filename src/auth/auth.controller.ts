import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { Logindto } from './dto/logindto';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    @Post('signup/customer')
    async customersignup(@Body()dto:RegistrationDto, @Res()res):Promise<{message:"welcome to ned fashion "}>{
        try {
            await this.authservice.CustomerSignup(dto)
            return res.data
            
        } catch (error) {
            
        }
        
    }

   


    @Post("login")
    async login(@Body()logindto:Logindto){
        return await this.authservice.login(logindto)
    }
}
