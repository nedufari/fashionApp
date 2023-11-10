//sign up for vendor, customer, photographer and model 

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../../Entity/Users/customer.entity";
import { CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository } from "../auth.repository";
import { vendorEntity } from "../../Entity/Users/vendor.entity";
import { ModelEntity } from "../../Entity/Users/model.entity";
import { PhotographerEntity } from "../../Entity/Users/photorapher.entity";
import { UserOtp } from "../../Entity/userotp.entity";
import { Notifications } from "../../Entity/Notification/notification.entity";
import { MailService } from "../../mailer.service";
import { AuthService } from "../auth.service";
import { WaitlistModeleRegistrationDto, WaitlistPhotographerRegistrationDto, WaitlistVendorRegistrationDto } from "./waitlistauth.dto";
import { NotificationType } from "../../Enums/notificationTypes.enum";
import { generate2FACode4digits, generateRandomFallbackNames4Photographers, generateRandomFallbackNames4Vendors } from "../../helpers";
import { VerifyOtpdto } from "../dto/logindto";
import { RequestOtpResendDto } from "../dto/registrationdto";
import { KindOfModel } from "../../Enums/modelType.enum";
import * as datamuse  from 'datamuse'

//verify otp for them too 
@Injectable()
export class WaitListService{
    constructor( 
    @InjectRepository(CustomerEntity)
    private customerrepository: CustomerEntityRepository,
    @InjectRepository(vendorEntity)
    private vendorrepository: VendorEntityRepository,
    @InjectRepository(ModelEntity)
    private modelrepository: ModelEntityRepository,
    @InjectRepository(PhotographerEntity)
    private photographerrepository: PhotographerEntityRepository,
    @InjectRepository(UserOtp)
    private otprepository: OtpRepository,
    @InjectRepository(Notifications)
    private notificationrepository: NotificationsRepository,
    private mailerservice:MailService,
    private authservice:AuthService){}


    //register vendor, model and photographer
    // verify otp for all and resend otp for all 

    //vendor  
    //(sign up)

  

    async WaitlistVendorSignup(userdto: WaitlistVendorRegistrationDto,): Promise<{message:string}> {
        try {
          const hashedpassword = await this.authservice.hashpassword(userdto.password);
          const vendor = new vendorEntity()
          vendor.email=userdto.email
          vendor.password=hashedpassword
          vendor.brandname=userdto.brandname
          vendor.VendorID=this.authservice.generateIdentityNumber()
          
          const emailexsist = await this.vendorrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
          if (emailexsist)
            throw new HttpException(
              `user with email: ${userdto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
    
                 // Check if a user with the same username already exists
        const existingUserByUsername = await this.vendorrepository.findOne({ where: { brandname: userdto.brandname }, select: ['id', 'brandname'] });
        if (existingUserByUsername) {
          // Generate brandname suggestions
          const suggestions = await generateRandomFallbackNames4Vendors(userdto.brandname,3);
          throw new HttpException(
            ` ${userdto.brandname} already taken. Please choose another brandname or consider these suggestions: ${suggestions.join(',')}`,
            HttpStatus.CONFLICT,
          );
        }
            await this.vendorrepository.save(vendor);
    
          //2fa authentication 
        const emiailverificationcode =  generate2FACode4digits()
        const verificationlink = `http://localhost:3000/api/v1/waitlist/vendor/verify-otp?token=${emiailverificationcode}&email=${userdto.email} `
    
          const otp= new UserOtp()
          otp.email=userdto.email
          otp.otp=emiailverificationcode
          otp.role= vendor.role
          const fiveminuteslater=new Date()
          await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
          otp.expiration_time=fiveminuteslater
          await this.otprepository.save(otp)
          console.log('vendor account created please check your mail to verify your account, by inputing the six digit OTP sent to you')
    
          //send mail 
          await this.mailerservice.SendVerificationMail(otp.email,verificationlink,vendor.brandname)
         
    
          //save the notification 
          const notification = new Notifications()
          notification.account= vendor.id
          notification.subject="New Vendor!"
          notification.notification_type=NotificationType.SIGNED_UP
          notification.message=`Hello ${vendor.brandname}, your vendor account  has been created. please proceed to verify your email `
          await this.notificationrepository.save(notification)
    
          return {message:"new vendor signed up, please procceed to verify your email "}
        
        } catch (error) {
          throw error
         
        }
       
      }

      //(verify otp)

      async WaitlistverifyVendorotp(token:string, email:string):Promise<{isValid:boolean; welcome:any}>{
        const findemail= await this.otprepository.findOne({where:{email:email}})
        if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
        //find the otp privided if it matches with the otp stored 
        const findotp= await this.otprepository.findOne({where:{otp:token}})
        if (!findotp) throw new HttpException('you provided an invalid otp,please go back to your mail and confirm the OTP sent to you', HttpStatus.BAD_REQUEST)
        
        //find if the otp is expired 
        if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)
    
        //return valid and the access token if the user matches 
    
        const vendor = await this.vendorrepository.findOne({where:{email:email}})
        if (vendor.email !== findemail.email) throw new HttpException("this email does not match the customer record we have ", HttpStatus.NOT_FOUND)
        else{
         
          vendor.is_verified=true
          vendor.is_on_waitlist=true
        
    
         const notification = new Notifications()
          notification.account= vendor.id,
          notification.subject="Vendor Verified!"
          notification.notification_type=NotificationType.OTP_VERIFICATION
          notification.message=`Hello ${vendor.brandname}, your email has been successfully verified `
          await this.notificationrepository.save(notification)
    
          await this.mailerservice.SendWelcomeEmail(vendor.email,vendor.brandname)
    
          await this.customerrepository.save(vendor)
    
        const welcome= "your account has been verified and thanks for joinig the waitlist as a vendor"
    
        return {isValid:true, welcome}
        }
    
      }

      //(resend otp)

      async WaitlistresendVendorOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
        const emailexsist = await this.vendorrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
          if (!emailexsist)
            throw new HttpException(
              `user with email: ${dto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
         // Generate a new OTP
         const emiailverificationcode= generate2FACode4digits() // Your OTP generated tokens
         const verificationlink = `http://localhost:3000/api/v1/waitlist/vendor/verify-otp?token=${emiailverificationcode}&email=${dto.email} `
    
         // Save the OTP with expiration time
         const fiveminuteslater=new Date()
         await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
         // Define OTP_EXPIRATION_MINUTES
         const newOtp = this.otprepository.create({ 
          email:dto.email, 
          otp:emiailverificationcode, 
          expiration_time: fiveminuteslater,
          role: emailexsist.role
        });
         await this.otprepository.save(newOtp);
    
         //save the notification 
         const notification = new Notifications()
         notification.account= emailexsist.id
         notification.subject="New Customer!"
         notification.notification_type=NotificationType.OTP_VERIFICATION
         notification.message=`Hello ${emailexsist.brandname}, a new verification Link has been sent to your mail `
         await this.notificationrepository.save(notification)
     
         
           //send mail 
           await this.mailerservice.SendVerificationMail(newOtp.email,verificationlink, emailexsist.brandname)
    
           return {message:'New Verification Link sent successfully'}
           
       }



    //photographer
    //(sign up)

    async WaitlistPhotographerSignup(userdto: WaitlistPhotographerRegistrationDto,): Promise<{message:string}> {
        try {
          const hashedpassword = await this.authservice.hashpassword(userdto.password);
          const photographer = new PhotographerEntity()
          photographer.email=userdto.email
          photographer.password=hashedpassword
          photographer.brandname=userdto.brandname
          photographer.PhotographerID=this.authservice.generateIdentityNumber()
          
          const emailexsist = await this.photographerrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
          if (emailexsist)
            throw new HttpException(
              `user with email: ${userdto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
    
                 // Check if a user with the same username already exists
        const existingUserByUsername = await this.photographerrepository.findOne({ where: { brandname: userdto.brandname }, select: ['id', 'brandname'] });
        if (existingUserByUsername) {
          // Generate username suggestions
          const suggestions = await generateRandomFallbackNames4Photographers(userdto.brandname,3);
          throw new HttpException(
            `${userdto.brandname} already taken. Please choose another brandname or consider these suggestions: ${suggestions.join(', ')}`,
            HttpStatus.CONFLICT,
          );
        }
            await this.photographerrepository.save(photographer);
    
          //2fa authentication 
        const emiailverificationcode= generate2FACode4digits()
        const verificationlink = `http://localhost:3000/api/v1/waitlist/photographer/verify-otp?token=${emiailverificationcode}&email=${userdto.email} `

    
          const otp= new UserOtp()
          otp.email=userdto.email
          otp.otp=emiailverificationcode
          otp.role= photographer.role
          const fiveminuteslater=new Date()
          await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
          otp.expiration_time=fiveminuteslater
          await this.otprepository.save(otp)
          console.log('photographer account created please check your mail to verify your account, by inputing the six digit OTP sent to you')
    
          //send mail 
          await this.mailerservice.SendVerificationMail(otp.email,verificationlink,photographer.brandname)
    
          //save the notification 
          const notification = new Notifications()
          notification.account= photographer.id
          notification.subject="New Photographer!"
          notification.notification_type=NotificationType.SIGNED_UP
          notification.message=`Hello ${photographer.brandname}, your photographer account has been created. please proceed to verify your email `
          await this.notificationrepository.save(notification)
    
          return {message:"new Photographer signed up, please proceed to verify your email "}
        
        } catch (error) {
          throw error
          
        }
       
      }



      //( verify otp)
      async WaitlistverifyPhotographerEmail(email:string, token:string):Promise<{isValid:boolean; welcome:any}>{
        const findemail= await this.otprepository.findOne({where:{email:email}})

        if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
        //find the otp privided if it matches with the otp stored 

        const findotp= await this.otprepository.findOne({where:{otp:token}})
        if (!findotp) throw new HttpException('you prided an invalid otp', HttpStatus.BAD_REQUEST)
        
        //find if the otp is expired 
        if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)
    
        //return valid and the access token if the user matches 
        const photographer = await this.photographerrepository.findOne({where:{email:email}})
        if (photographer.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
        else{
          
          photographer.is_verified=true
          photographer.is_on_waitlist=true
        
    
         const notification = new Notifications()
          notification.account= photographer.id,
          notification.subject="Photographer Verified!"
          notification.notification_type=NotificationType.OTP_VERIFICATION
          notification.message=`Hello ${photographer.brandname}, email has been successfully verified `
          await this.notificationrepository.save(notification)
    
          await this.mailerservice.SendWelcomeEmail(photographer.email,photographer.brandname)
    
          await this.customerrepository.save(photographer)
    
    
        const welcome= "your account has been verified and thanks for joinig the waitlist as a photographer"
    
        return {isValid:true, welcome}
        }
    
    
      }

      //(resend otp)
      async WaitlistresendPhotographerOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
        const emailexsist = await this.photographerrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
          if (!emailexsist)
            throw new HttpException(
              `user with email: ${dto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
         // Generate a new OTP
         const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic
         const verificationlink = `http://localhost:3000/api/v1/waitlist/photographer/verify-otp?token=${emiailverificationcode}&email=${dto.email} `
    
         // Save the OTP with expiration time
         const fiveminuteslater=new Date()
         await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
         // Define OTP_EXPIRATION_MINUTES
         const newOtp = this.otprepository.create({ 
          email:dto.email, 
          otp:emiailverificationcode, 
          expiration_time: fiveminuteslater,
          role: emailexsist.role
        });
         await this.otprepository.save(newOtp);
    
         //save the notification 
         const notification = new Notifications()
         notification.account= emailexsist.id
         notification.subject="New Verification Link Sent!"
         notification.notification_type=NotificationType.OTP_VERIFICATION
         notification.message=`Hello ${emailexsist.brandname}, a token has been sent to your mail `
         await this.notificationrepository.save(notification)
     
         
           //send mail 
           await this.mailerservice.SendVerificationMail(newOtp.email,verificationlink, emailexsist.brandname)
    
           return {message:'New Verification Link sent successfully'}
           
       }



//models 
//(sign up)

async Waitlistmodelsignup(modeldto: WaitlistModeleRegistrationDto): Promise<{message:string}> {

    const dob = new Date(modeldto.dob)
    const today = new Date()
    const age =today.getFullYear() - dob.getFullYear()

    const hashedpassword = await this.authservice.hashpassword(modeldto.password);

    //pre save the model data
    const model = new ModelEntity()
    model.email=modeldto.email
    model.password=hashedpassword
    model.name=modeldto.name
    model.DOB = modeldto.dob
    model.age=age


    if (age < 1 || age > 15) {

      model.kindofmodel= KindOfModel.ADULT}
      else{

      if (!modeldto.manager || !modeldto.managerPhone){
        throw new HttpException('kid model requires manager and manager\'s phone number since child is below 15',HttpStatus.BAD_REQUEST)
      }
      model.manager=modeldto.manager
      model.ManagerPhone=modeldto.managerPhone
      model.kindofmodel= KindOfModel.KID
      
    }
    model.ModelID=this.authservice.generateIdentityNumber()


    const emailexsist = await this.modelrepository.findOne({
      where: { email: modeldto.email },
      select: ['id', 'email'],
    });
    if (emailexsist)
      throw new HttpException(
        `user with email: ${modeldto.email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );



    await this.modelrepository.save(model)

      //2fa authentication 
      const emiailverificationcode= generate2FACode4digits()
      const verificationlink = `http://localhost:3000/api/v1/waitlist/model/verify-otp?token=${emiailverificationcode}&email=${modeldto.email} `

      const otp= new UserOtp()
      otp.email=modeldto.email
      otp.otp=emiailverificationcode
      otp.role= model.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('model account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,verificationlink,model.username)
      //  await this.mailerservice.SendMail(otp.email,subject,content)

      //save the notification 
      const notification = new Notifications()
      notification.account= model.id
      notification.subject="New Model!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${model.username}, your  model account has been created as a ${model.kindofmodel}. please complete procced to verify your email `
      await this.notificationrepository.save(notification)

      return {message:"new model signed up, please procceed to verify your email "}
    
  }

   
  async WaitlistModelverifyotp(email, token:string):Promise<{isValid:boolean; welcome:any}>{
    const findemail= await this.otprepository.findOne({where:{email:email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:token}})
    if (!findotp) throw new HttpException('you prided an invalid otp', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const customer = await this.modelrepository.findOne({where:{email:email}})
    if (customer.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
    else{
      customer.is_logged_in=true
      customer.is_verified=true
      customer.is_active=true
    

     const notification = new Notifications()
      notification.account= customer.id,
      notification.subject="Model Verified!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${customer.username}, your email has been successfully verified `
      await this.notificationrepository.save(notification)

      await this.mailerservice.SendWelcomeEmail(customer.email,customer.username)

      await this.customerrepository.save(customer)

    const welcome= "your account has been verified and thanks for joinig the waitlist as a model"

    return {isValid:true, welcome}
    }
  }

  async WaitlistresendModelOtp (resendOtpdto:RequestOtpResendDto):Promise<{message:string}>{
    const emailexsist = await this.modelrepository.findOne({where: { email: resendOtpdto.email },select: ['id', 'email','role']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${resendOtpdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
     // Generate a new OTP
     const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic
     const verificationlink = `http://localhost:3000/api/v1/waitlist/model/verify-otp?token=${emiailverificationcode}&email=${resendOtpdto.email} `

     // Save the OTP with expiration time
     const fiveminuteslater=new Date()
     await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+30)
     // Define OTP_EXPIRATION_MINUTES
     const newOtp = this.otprepository.create({ 
      email:resendOtpdto.email, 
      otp:emiailverificationcode, 
      expiration_time: fiveminuteslater,
      role: emailexsist.role
    });
     await this.otprepository.save(newOtp);

      //save the notification 
      const notification = new Notifications()
      notification.account= emailexsist.id
      notification.subject="New verification Link Sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${emailexsist.name}, a new verification Link has been sent to your email `
      await this.notificationrepository.save(notification)
 
     
       //send mail 
       await this.mailerservice.SendVerificationMail(newOtp.email,emiailverificationcode, emailexsist.name)

       return {message:'New Verification Link successfully'}
       
   }









}