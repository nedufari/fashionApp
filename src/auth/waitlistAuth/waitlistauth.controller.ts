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


    //verify user 

    @Post('vendor/verify-email')
    async WaitlistVendorverifyEmail(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        const result = await this.waitlistservice.WaitlistverifyVendorEmail(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('photographer/verify-email')
    async WaitlistPhotographerverifyEmail(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        
        const result = await this.waitlistservice.WaitlistverifyPhotographerEmail(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('model/verify-email')
    async WaitlistModelverifyEmail(@Query("token") token:string,@Query("email")email:string,): Promise<{ isValid: boolean; welcome: any }> {
      try {
        const result = await this.waitlistservice.WaitlistModelverifyEmail(email,token);
        return { isValid: result.isValid, welcome: result.welcome};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    

    //resend verification link

    @Post('vendor/request-otp-resend')
    async VendorrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendVendorVerificationLink(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New verification link sent successfully' };
    }

    @Post('model/request-otp-resend')
    async ModelrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendModelVerificationLink(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New verification link sent successfully' };
    }

    @Post('photographer/request-otp-resend')
    async PhotographerrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.waitlistservice.WaitlistresendPhotographerVerificationLink(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New verification link sent successfully' };
    }
}