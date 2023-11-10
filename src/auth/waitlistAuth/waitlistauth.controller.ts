import { Body, Controller,HttpException,HttpStatus,Post, Query, Req, Request } from "@nestjs/common";
import { WaitListService } from "./waitlistauth.service";
import { WaitlistModeleRegistrationDto, WaitlistPhotographerRegistrationDto, WaitlistVendorRegistrationDto } from "./waitlistauth.dto";
import { VerifyOtpdto } from "../dto/logindto";
import { RequestOtpResendDto } from "../dto/registrationdto";

@Controller('waitlist')
export class WaitListController{
    constructor(private waitlistservice:WaitListService){}

    //sign up 

    @Post('signup/vendor')
    async Vendorsignup(@Body()dto:WaitlistVendorRegistrationDto):Promise<{message:"welcome to walkway "}>{
        try {
            await this.waitlistservice.WaitlistVendorSignup(dto)
            return {message:"welcome to walkway "}
        
            
        } catch (error) {
            throw error
            
        }
        
    }

    @Post('signup/photographer')
    async Photographersignup(@Body()dto:WaitlistPhotographerRegistrationDto):Promise<{message:string}>{
        try {
          return  await this.waitlistservice.WaitlistPhotographerSignup(dto)
            
        
        } catch (error) {
            throw error
            
        }      
        
    }


    @Post('signup/model')
    async kidmodelsignup(@Body()dto:WaitlistModeleRegistrationDto):Promise<{message:string}>{
        try {
           return await this.waitlistservice.Waitlistmodelsignup(dto)
            
            
        } catch (error) {
            throw error
            
        }      
        
    }


    //verify otp 

    @Post('vendor/verify-otp')
    async WaitlistVendorverifyOtp(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        const result = await this.waitlistservice.WaitlistverifyVendorotp(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('photographer/verify-otp')
    async WaitlistPhotographerverifyOtp(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        
        const result = await this.waitlistservice.WaitlistverifyPhotographerotp(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('model/verify-otp')
    async WaitlistModelverifyOtp(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        const result = await this.waitlistservice.WaitlistModelverifyotp(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    

    //resend otp

    @Post('vendor/request-otp-resend')
    async VendorrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendVendorOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }

    @Post('model/request-otp-resend')
    async KidrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendModelOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }

    @Post('photographer/request-otp-resend')
    async requestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendPhotographerOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }
}