import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, Res,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdultModelRegistrationDto, RegistrationDto, RequestOtpResendDto, VendorRegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { Logindto, VerifyOtpdto } from './dto/logindto';
import { Response } from 'express';
import { JwtGuard } from './guards/jwt.guards';
import { ChangePasswordDto, FinallyResetPasswordDto, SendPasswordResetLinkDto } from './dto/password.dto';

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


    @Post('customer/verify-otp')
    async verifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.verifyotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('vendor/verify-otp')
    async VendorverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.verifyVendorotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('photographer/verify-otp')
    async PhotographerverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.verifyPhotographerotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('kidmodel/verify-otp')
    async KidModelverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.KidsModelverifyotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('customer/verify-otp')
    async AdultModelverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.AdultModelverifyotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('admin/verify-otp')
    async AdminverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.Adminverifyotp(verifyOtpDto);
        return { isValid: result.isValid, accessToken: result.accessToken};
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    @Post('customer/request-otp-resend')
    async CustomerrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendCustomerOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }

    @Post('vendor/request-otp-resend')
    async VendorrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendVendorOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }

    @Post('adult/request-otp-resend')
    async AdultrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendAdultModelOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }


    @Post('kid/request-otp-resend')
    async KidrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendKidsModelOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
    }

    @Post('photographer/request-otp-resend')
    async requestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendPhotographerOtp(requestOtpResendDto); // Assuming you have a method to send OTP
      return { message: 'New OTP sent successfully' };
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


    /////customer ////
     
    @Patch("/customer/changePassword")
    async changePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
        return await this.authservice.chnangepassword(changepassword,customerid)
    }

    @Post("/customer/resetlink")
    async PasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.authservice.sendPasswordResetLink(email)
    }

    @Patch("customer/resetPassword")
    async ResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.authservice.finallyResetPassword(dto)
    }


     /////vendor ////
     
     @Patch("/vendor/changePassword")
     async VendorchangePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
         return await this.authservice.chnangeVendorpassword(changepassword,customerid)
     }
 
     @Post("/vendor/resetlink")
     async VendorPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
         return await this.authservice.sendVendorPasswordResetLink(email)
     }
 
     @Patch("vendor/resetPassword")
     async VendorResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
         return await this.authservice.VendorfinallyResetPassword(dto)
     }


      /////photographer ////
     
    @Patch("/photographer/changePassword")
    async PhotographerchangePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
        return await this.authservice.Photographerchnangepassword(changepassword,customerid)
    }

    @Post("/photographer/resetlink")
    async PhotographerPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.authservice.sendPhotographerPasswordResetLink(email)
    }

    @Patch("photographer/resetPassword")
    async PhotographerResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.authservice.PhotographerfinallyResetPassword(dto)
    }


     /////kidmodel ////
     
     @Patch("/kidmodel/changePassword")
     async KidmodelchangePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
         return await this.authservice.KidsModelchnangepassword(changepassword,customerid)
     }
 
     @Post("/kidmodel/resetlink")
     async KidmodelPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
         return await this.authservice.KidsModelsendPasswordResetLink(email)
     }
 
     @Patch("kidmodel/resetPassword")
     async KidmodelResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
         return await this.authservice.finallyKidsModelResetPassword(dto)
     }

      /// adult model ////
     
    @Patch("/customer/changePassword")
    async AdultModelchangePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
        return await this.authservice.AdultModelchnangepassword(changepassword,customerid)
    }

    @Post("/customer/resetlink")
    async AdultModelPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.authservice.AdultModelsendPasswordResetLink(email)
    }

    @Patch("customer/resetPassword")
    async AdultResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.authservice.finallyAdultModelResetPassword(dto)
    }

     ///// admin ////
     
     @Patch("/admin/changePassword")
     async AdminchangePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string):Promise<{message:string}>{
         return await this.authservice.Adminchnangepassword(changepassword,customerid)
     }
 
     @Post("/admin/resetlink")
     async AdminPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
         return await this.authservice.AdminsendPasswordResetLink(email)
     }
 
     @Patch("admin/resetPassword")
     async AdminResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
         return await this.authservice.AdminfinallyResetPassword(dto)
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

