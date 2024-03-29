import { Body, Controller, ForbiddenException, HttpException, HttpStatus, Param, Patch, Post, Req, Res,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminRegistrationDto, AdultModelRegistrationDto, RegistrationDto, RequestOtpResendDto, VendorRegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { AdminLogindto, Logindto, VerifyOtpdto } from './dto/logindto';
import { Response } from 'express';
// import { JwtGuard } from './guards/jwt.guards';
import { ChangePasswordDto, FinallyResetPasswordDto, SendPasswordResetLinkDto } from './dto/password.dto';
import { JwtGuard } from './guards/jwt.guards';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    @Post('signup/customer')
    async customersignup(@Body()dto:RegistrationDto):Promise<{message:string}>{
        try {
           return await this.authservice.CustomerSignup(dto)
             
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

    @Post('model/verify-otp')
    async KidModelverifyOtp(@Body() verifyOtpDto:VerifyOtpdto): Promise<{ isValid: boolean; accessToken: any }> {
      try {
        const result = await this.authservice.Modelverifyotp(verifyOtpDto);
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

    


    @Post('model/request-otp-resend')
    async KidrequestOtpResend(@Body() requestOtpResendDto: RequestOtpResendDto): Promise<{ message: string }> {
      await this.authservice.resendModelOtp(requestOtpResendDto); // Assuming you have a method to send OTP
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
    async Photographersignup(@Body()dto:RegistrationDto):Promise<{message:string}>{
        try {
          return  await this.authservice.PhotographerSignup(dto)
            
        
        } catch (error) {
            throw error
            
        }      
        
    }


    @Post('signup/model')
    async kidmodelsignup(@Body()dto:kidsModeleRegistrationDto):Promise<{message:string}>{
        try {
           return await this.authservice.modelsignup(dto)
            
            
        } catch (error) {
            throw error
            
        }      
        
    }


    @Post('signup/admin')
    async Adminsignup(@Body()dto:AdminRegistrationDto):Promise<{message:string}>{
        try {
            return await this.authservice.AdminSignup(dto)
            
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


    
    @Post("login/admin")
    async loginAdmin(@Body()logindto:AdminLogindto){
        return await this.authservice.loginAdmmin(logindto)
    }


    /////customer ////
     @UseGuards(JwtGuard)
    @Patch("/customer/changePassword/:customerid")
    async changePassword(@Body()changepassword:ChangePasswordDto,@Param('customerid')customerid:string,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
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
     @UseGuards(JwtGuard)
     @Patch("/vendor/changePassword/:vendorid")
     async VendorchangePassword(@Body()changepassword:ChangePasswordDto,@Param('vendorid')vendorid:string,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== vendorid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
         return await this.authservice.chnangeVendorpassword(changepassword,vendorid)
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
      @UseGuards(JwtGuard)
    @Patch("/photographer/changePassword/:photoid")
    async PhotographerchangePassword(@Body()changepassword:ChangePasswordDto,@Param('photoid')photoid:string,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== photoid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        return await this.authservice.Photographerchnangepassword(changepassword,photoid)
    }

    @Post("/photographer/resetlink")
    async PhotographerPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.authservice.sendPhotographerPasswordResetLink(email)
    }

    @Patch("photographer/resetPassword")
    async PhotographerResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.authservice.PhotographerfinallyResetPassword(dto)
    }


     /////model ////
     @UseGuards(JwtGuard)
     @Patch("/model/changePassword/:kidmodelid")
     async KidmodelchangePassword(@Body()changepassword:ChangePasswordDto,@Param('kidmodelid')kidmodelid:string,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== kidmodelid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
         return await this.authservice.Modelchnangepassword(changepassword,kidmodelid)
     }
 
     @Post("/model/resetlink")
     async KidmodelPasswordResetLink(@Body()email:SendPasswordResetLinkDto):Promise<{message:string}>{
         return await this.authservice.ModelsendPasswordResetLink(email)
     }
 
     @Patch("model/resetPassword")
     async KidmodelResetPasswordFinally(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
         return await this.authservice.finallyModelResetPassword(dto)
     }


     ///// admin ////
     @UseGuards(JwtGuard)
     @Patch("/admin/changePassword/:adminid")
     async AdminchangePassword(@Body()changepassword:ChangePasswordDto,@Param('adminid')adminid:string,@Req()request):Promise<{message:string}>{
      const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== adminid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
         return await this.authservice.Adminchnangepassword(changepassword,adminid)
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
    // @UseGuards(JwtGuard)
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

