import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {AdminRegistrationDto, AdultModelRegistrationDto, RegistrationDto,RequestOtpResendDto,VendorRegistrationDto,kidsModeleRegistrationDto,} from './dto/registrationdto';
import { ConfigService } from '@nestjs/config';
import { AdminLogindto, Logindto, VerifyOtpdto } from './dto/logindto';
import { AdminEntityRepository, CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository, WalletRepository } from './auth.repository';
import { IAdminResponse } from '../Users/admin/admin.interface';
import { ICustomerResponse } from '../Users/customers/customers.interface';
import { generate2FACode4digits, generate2FACode6digits } from '../helpers';
import { UserOtp } from '../Entity/userotp.entity';
import { MailService } from '../mailer.service';
import { Notifications } from '../Entity/Notification/notification.entity';
import { NotificationType } from '../Enums/notificationTypes.enum';
import { AdminEntity } from '../Entity/Users/admin.entity';
import { CustomerEntity } from '../Entity/Users/customer.entity';
import { vendorEntity } from '../Entity/Users/vendor.entity';
import { ModelEntity } from '../Entity/Users/model.entity';
import { PhotographerEntity } from '../Entity/Users/photorapher.entity';
import { customAlphabet, nanoid } from 'nanoid';
import { ChangePasswordDto, FinallyResetPasswordDto, SendPasswordResetLinkDto } from './dto/password.dto';
import { AdminTypes, ClearanceLevels } from '../Enums/roles.enum';
import { Wallet } from '../Entity/wallet/wallet.entity';
import { KindOfModel } from '../Enums/modelType.enum';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminrepository: AdminEntityRepository,
    @InjectRepository(CustomerEntity)
    private customerrepository: CustomerEntityRepository,
    private jwt: JwtService,
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
    @InjectRepository(Wallet) private readonly walletripo:WalletRepository,
    private configservice: ConfigService,
    private mailerservice:MailService
  ) {}

  async hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }


  //wallet transaction pin 
  public async hashpin(pin: string): Promise<string> {
    return await bcrypt.hash(pin, 20);
  }

  public async comaprePassword(userpassword,dbpassword): Promise<boolean> {
    return await bcrypt.compare(userpassword,dbpassword);
  }

  public generateIdentityNumber():string{
    return nanoid(8)
  }

  public generatePasswordResetLink():string{
    const nanoid = customAlphabet('1234567890',6)
    return nanoid()
  }

  public generateWalletTransactionPin():string{
    const nanoid = customAlphabet('1234567890',4)
    return nanoid()
  }


  async generateUsernameSuggestions(originalUsername: string): Promise<string[]> {
    const suggestions: string[] = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxzABCDEFGHIJLMNOPQRSTUVWXYZ';
    const nanoid = customAlphabet(alphabet, 3); // Customize the length of the suggestions as needed
  
    for (let i = 1; i <= 4; i++) {
      let suggestion;
      do {
        suggestion = `${originalUsername}${nanoid()}`; // Include originalUsername as a prefix
      } while (suggestions.includes(suggestion)); // Ensure it's unique
  
      suggestions.push(suggestion);
    }
  
    return suggestions;
  }
  ///signup for various users


  async AdminSignup(userdto: AdminRegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const admin = new AdminEntity()
      admin.email=userdto.email
      admin.password=hashedpassword
      admin.username=userdto.username
      admin.AdminType = AdminTypes.SUPER_ADMIN
      admin.ClearanceLevel = ClearanceLevels.SUPER
      admin.AdminID=this.generateIdentityNumber()
      
      const emailexsist = await this.adminrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
   
      if (emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );

        // Check if a user with the same username already exists
    const existingUserByUsername = await this.adminrepository.findOne({ where: { username: userdto.username }, select: ['id', 'username'] });
    if (existingUserByUsername) {
      // Generate username suggestions
      const suggestions = await this.generateUsernameSuggestions(userdto.username);
      throw new HttpException(
        `Admin User with username: ${userdto.username} already exists. Please choose another username or consider these suggestions: ${suggestions.join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
        await this.adminrepository.save(admin);

      //2fa authentication 
    const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=userdto.email
      otp.otp=emiailverificationcode
      otp.role= admin.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('admin account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,admin.username)
      //  await this.mailerservice.SendMail(otp.email,subject,content)

      //save the notification 
      const notification = new Notifications()
      notification.account= admin.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${admin.username}, your customer has been created. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:`new coustomer signed up and verification otp has been sent, please copy this adminID ${admin.AdminID}, it would be used to sign you in when you are logged out. it is important you share it with no one and never loose it `}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }
  }

  
  async Adminverifyotp(verifyotpdto:VerifyOtpdto):Promise<{isValid:boolean; accessToken:any}>{
    
    const findemail= await this.otprepository.findOne({where:{email:verifyotpdto.email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)

    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:verifyotpdto.otp}})
    if (!findotp) throw new HttpException('you provided an invalid otp', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const customer = await this.adminrepository.findOne({where:{email:verifyotpdto.email}})
    if (customer.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
    else{
      customer.is_logged_in=true
      customer.is_verified=true
      customer.is_active=true
    }


     const notification = new Notifications()
      notification.account= customer.id,
      notification.subject="OTP sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${customer.username}, otp sent to this email for verification `
      await this.notificationrepository.save(notification)



    const accessToken= await this.signToken(customer.id,customer.email,customer.role)

    return {isValid:true, accessToken}


  }

  async Adminchnangepassword(dto:ChangePasswordDto, customerid:string):Promise<{message:string}>{
    const customer = await this.adminrepository.findOne({where:{AdminID:customerid}})
    if (!customer) throw new HttpException(`customer with ${customerid} does not exist and you cant be allowed to change a password`,HttpStatus.NOT_FOUND)

    //confirm the oldpassword with the saved password
    const ispasswordMatch= await this.comaprePassword(customer.password,dto.oldPassword)
    if (!ispasswordMatch) throw new HttpException('the provided old password is not a match with the current password please provide, else you wont be allowed to perform this action', HttpStatus.NOT_ACCEPTABLE)

    //input new password 
    const newPassword= await this.hashpassword(dto.newpassword)
    customer.password= newPassword

    //compare the new and old password 
    const isnewoldSame= await this.comaprePassword(dto.newpassword,customer.password)
    if (isnewoldSame) throw new HttpException('your new password must be different from the old one for a stronger security',HttpStatus.NOT_ACCEPTABLE)
    await this.adminrepository.save(customer)

    const notification = new Notifications()
    notification.account= customer.id,
    notification.subject="Password changed!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${customer.username}, password has been succsfully chnaged `
    await this.notificationrepository.save(notification)



    return {message:"your password has been changed successfully"}

  }


  async AdminsendPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.adminrepository.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= this.generatePasswordResetLink()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link = resetlink
    isEmailReistered.reset_link_exptime = expirationTime
    await this.adminrepository.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${isEmailReistered.username}, password resent link sent `
    await this.notificationrepository.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async AdminfinallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyuser= await this.adminrepository.findOne({where:{email:dto.email}})
    if (!verifyuser) throw new HttpException('this user is not registered on walkway',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyuser.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyuser.password=newpassword

    await this.adminrepository.save(verifyuser)

    const notification = new Notifications()
    notification.account= verifyuser.id,
    notification.subject="New Customer!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${verifyuser.username}, password reset link verified and the password has been recently reseted `
    await this.notificationrepository.save(notification)


    return {message:"your password has been reset susscessfully"}
  }

  //////// customer ////////////////////////////////////////////


  async CustomerSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const customer = new CustomerEntity()
      customer.email=userdto.email
      customer.password=hashedpassword
      customer.username=userdto.username
      customer.CustomerID=this.generateIdentityNumber()
      
      const emailexsist = await this.customerrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );

             // Check if a user with the same username already exists
    const existingUserByUsername = await this.customerrepository.findOne({ where: { username: userdto.username }, select: ['id', 'username'] });
    if (existingUserByUsername) {
      // Generate username suggestions
      const suggestions = await this.generateUsernameSuggestions(userdto.username);
      throw new HttpException(
        `User with username: ${userdto.username} already exists. Please choose another username or consider these suggestions: ${suggestions.join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
        await this.customerrepository.save(customer);

      //2fa authentication 
    const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=userdto.email
      otp.otp=emiailverificationcode
      otp.role= customer.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('customer account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send otp verification email
     
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,customer.username)

      //save the notification 
      const notification = new Notifications()
      notification.account= customer.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${customer.username}, your customer has been created. please complete your profile `
      await this.notificationrepository.save(notification)

     
      return {message:"new coustomer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }

  async verifyotp(verifyotpdto:VerifyOtpdto):Promise<{isValid:boolean; accessToken:any}>{
    const findemail= await this.otprepository.findOne({where:{email:verifyotpdto.email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:verifyotpdto.otp}})
    if (!findotp) throw new HttpException('you prided an invalid otp', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const customer = await this.customerrepository.findOne({where:{email:verifyotpdto.email}})
    if (customer.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
    else{
      customer.is_logged_in=true
      customer.is_active=true
      customer.is_verified=true

      //notification
     const notification = new Notifications()
      notification.account= customer.id,
      notification.subject="OTP sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${customer.username}, otp sent to this email for verification `
      await this.notificationrepository.save(notification)

      await this.mailerservice.SendWelcomeEmail(customer.email,customer.username)

      await this.customerrepository.save(customer)




    const accessToken= await this.signToken(customer.id,customer.email,customer.role)

    return {isValid:true, accessToken}
    }


  }

  async resendCustomerOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
    const emailexsist = await this.customerrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${dto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
     // Generate a new OTP
     const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic

     // Save the OTP with expiration time
     const fiveminuteslater=new Date()
     await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
     // Define OTP_EXPIRATION_MINUTES
     const newOtp = this.otprepository.create({ 
      email:dto.email, 
      otp:emiailverificationcode, 
      expiration_time: fiveminuteslater,
      role: emailexsist.role
    });
     await this.otprepository.save(newOtp);
 
     
       //send mail 
       await this.mailerservice.SendVerificationMail(newOtp.email,emiailverificationcode, emailexsist.username)

       return {message:'New OTP sent successfully'}
       
   }

  async chnangepassword(dto:ChangePasswordDto, customerid:string):Promise<{message:string}>{
    const customer = await this.customerrepository.findOne({where:{CustomerID:customerid}})
    if (!customer) throw new HttpException(`customer with ${customerid} does not exist and you cant be allowed to change a password`,HttpStatus.NOT_FOUND)

    //confirm the oldpassword with the saved password
    const ispasswordMatch= await this.comaprePassword(customer.password,dto.oldPassword)
    if (!ispasswordMatch) throw new HttpException('the provided old password is not a match with the current password please provide, else you wont be allowed to perform this action', HttpStatus.NOT_ACCEPTABLE)

    //input new password 
    const newPassword= await this.hashpassword(dto.newpassword)
    customer.password= newPassword

    //compare the new and old password 
    const isnewoldSame= await this.comaprePassword(dto.newpassword,customer.password)
    if (isnewoldSame) throw new HttpException('your new password must be different from the old one for a stronger security',HttpStatus.NOT_ACCEPTABLE)
    await this.customerrepository.save(customer)

    const notification = new Notifications()
    notification.account= customer.id,
    notification.subject="Password changed!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${customer.username}, password has been succsfully chnaged `
    await this.notificationrepository.save(notification)



    return {message:"your password has been changed successfully"}

  }


  async sendPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.customerrepository.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= this.generatePasswordResetLink()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link=resetlink
    isEmailReistered.reset_link_exptime=expirationTime
    await this.customerrepository.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${isEmailReistered.username}, password resent link sent `
    await this.notificationrepository.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async finallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyuser= await this.customerrepository.findOne({where:{email:dto.email}})
    if (!verifyuser) throw new HttpException('this user is not registered on walkway',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyuser.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyuser.password=newpassword

    await this.customerrepository.save(verifyuser)

    const notification = new Notifications()
    notification.account= verifyuser.id,
    notification.subject="New Customer!"
    notification.notification_type=NotificationType.RESET_PASSWORD
    notification.message=`Hello ${verifyuser.username}, password reset link verified and the password has been recently reseted `
    await this.notificationrepository.save(notification)


    return {message:"your password has been reset susscessfully"}
  }




/////////////////////////////////// vendor ////////////////////////////////////////////



  /// new vendor 
  async VendorSignup(userdto: VendorRegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const vendor = new vendorEntity()
      vendor.email=userdto.email
      vendor.password=hashedpassword
      vendor.brandname=userdto.brandname
      vendor.VendorID=this.generateIdentityNumber()
      
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
      const suggestions = await this.generateUsernameSuggestions(userdto.brandname);
      throw new HttpException(
        `Vendor with Brandname: ${userdto.brandname} already exists. Please choose another brandname or consider these suggestions: ${suggestions.join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
        await this.vendorrepository.save(vendor);

      //2fa authentication 
    const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=userdto.email
      otp.otp=emiailverificationcode
      otp.role= vendor.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('vendor account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,vendor.brandname)
     

      //save the notification 
      const notification = new Notifications()
      notification.account= vendor.id
      notification.subject="New Vendor!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${vendor.brandname}, your vendor account  has been created. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new coustomer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }

  
  async verifyVendorotp(verifyotpdto:VerifyOtpdto):Promise<{isValid:boolean; accessToken:any}>{
    const findemail= await this.otprepository.findOne({where:{email:verifyotpdto.email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:verifyotpdto.otp}})
    if (!findotp) throw new HttpException('you provided an invalid otp,please go back to your mail and confirm the OTP sent to you', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const vendor = await this.vendorrepository.findOne({where:{email:verifyotpdto.email}})
    if (vendor.email !== findemail.email) throw new HttpException("this email does not match the customer record we have ", HttpStatus.NOT_FOUND)
    else{
      vendor.is_logged_in=true
      vendor.is_verified=true
      vendor.is_active=true
    

     const notification = new Notifications()
      notification.account= vendor.id,
      notification.subject="OTP sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${vendor.brandname}, otp sent to this email for verification `
      await this.notificationrepository.save(notification)

      await this.mailerservice.SendWelcomeEmail(vendor.email,vendor.brandname)

      await this.customerrepository.save(vendor)

    const accessToken= await this.signToken(vendor.id,vendor.email,vendor.role)

    return {isValid:true, accessToken}
    }

  }

  async resendVendorOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
    const emailexsist = await this.vendorrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${dto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
     // Generate a new OTP
     const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic

     // Save the OTP with expiration time
     const fiveminuteslater=new Date()
     await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
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
     notification.message=`Hello ${emailexsist.brandname}, an otp has been forwarded to your mail `
     await this.notificationrepository.save(notification)
 
     
       //send mail 
       await this.mailerservice.SendVerificationMail(newOtp.email,emiailverificationcode, emailexsist.brandname)

       return {message:'New OTP sent successfully'}
       
   }
  

  async chnangeVendorpassword(dto:ChangePasswordDto, customerid:string):Promise<{message:string}>{
    const vendor = await this.vendorrepository.findOne({where:{VendorID:customerid}})
    if (!vendor) throw new HttpException(`customer with ${customerid} does not exist and you cant be allowed to change a password`,HttpStatus.NOT_FOUND)

    //confirm the oldpassword with the saved password
    const ispasswordMatch= await this.comaprePassword(vendor.password,dto.oldPassword)
    if (!ispasswordMatch) throw new HttpException('the provided old password is not a match with the current password please provide, else you wont be allowed to perform this action', HttpStatus.NOT_ACCEPTABLE)

    //input new password 
    const newPassword= await this.hashpassword(dto.newpassword)
    vendor.password= newPassword

    //compare the new and old password 
    const isnewoldSame= await this.comaprePassword(dto.newpassword,vendor.password)
    if (isnewoldSame) throw new HttpException('your new password must be different from the old one for a stronger security',HttpStatus.NOT_ACCEPTABLE)
    await this.vendorrepository.save(vendor)

    const notification = new Notifications()
    notification.account= vendor.id,
    notification.subject="Password changed!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${vendor.brandname}, password has been succsfully chnaged `
    await this.notificationrepository.save(notification)



    return {message:"your password has been changed successfully"}

  }


  async sendVendorPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.vendorrepository.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= this.generatePasswordResetLink()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link=resetlink
    isEmailReistered.reset_link_exptime=expirationTime
    await this.vendorrepository.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.PASSWORD_RESET_REQUEST
    notification.message=`Hello ${isEmailReistered.brandname}, password resent link sent `
    await this.notificationrepository.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async VendorfinallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyvendor= await this.vendorrepository.findOne({where:{email:dto.email}})
    if (!verifyvendor) throw new HttpException('this user is not registered on walkway',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyvendor.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyvendor.password=newpassword

    await this.vendorrepository.save(verifyvendor)

    const notification = new Notifications()
    notification.account= verifyvendor.id,
    notification.subject="Password Reset!"
    notification.notification_type=NotificationType.RESET_PASSWORD
    notification.message=`Hello ${verifyvendor.brandname}, password reset link verified and the password has been recently reseted `
    await this.notificationrepository.save(notification)


    return {message:"your password has been reset susscessfully"}
  }




  ///////////////////////////// pgotographer /////////////////////////////////////////

  //photographer 
  async PhotographerSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const photographer = new PhotographerEntity()
      photographer.email=userdto.email
      photographer.password=hashedpassword
      photographer.brandname=userdto.username
      photographer.PhotographerID=this.generateIdentityNumber()
      
      const emailexsist = await this.photographerrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );

             // Check if a user with the same username already exists
    const existingUserByUsername = await this.photographerrepository.findOne({ where: { brandname: userdto.username }, select: ['id', 'brandname'] });
    if (existingUserByUsername) {
      // Generate username suggestions
      const suggestions = await this.generateUsernameSuggestions(userdto.username);
      throw new HttpException(
        `Photographer with username: ${userdto.username} already exists. Please choose another username or consider these suggestions: ${suggestions.join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
        await this.photographerrepository.save(photographer);

      //2fa authentication 
    const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=userdto.email
      otp.otp=emiailverificationcode
      otp.role= photographer.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('customer account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,photographer.brandname)

      //save the notification 
      const notification = new Notifications()
      notification.account= photographer.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${photographer.brandname}, your photographer account has been created. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new Photographer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }
   
  }


  
  async verifyPhotographerotp(verifyotpdto:VerifyOtpdto):Promise<{isValid:boolean; accessToken:any}>{
    const findemail= await this.otprepository.findOne({where:{email:verifyotpdto.email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:verifyotpdto.otp}})
    if (!findotp) throw new HttpException('you prided an invalid otp', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const photographer = await this.photographerrepository.findOne({where:{email:verifyotpdto.email}})
    if (photographer.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
    else{
      photographer.is_logged_in=true
      photographer.is_verified=true
      photographer.is_active=true
    

     const notification = new Notifications()
      notification.account= photographer.id,
      notification.subject="OTP sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${photographer.brandname}, otp sent to this email for verification `
      await this.notificationrepository.save(notification)

      await this.mailerservice.SendWelcomeEmail(photographer.email,photographer.brandname)

      await this.customerrepository.save(photographer)


    const accessToken= await this.signToken(photographer.id,photographer.email,photographer.role)

    return {isValid:true, accessToken}
    }


  }


  async resendPhotographerOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
    const emailexsist = await this.photographerrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${dto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
     // Generate a new OTP
     const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic

     // Save the OTP with expiration time
     const fiveminuteslater=new Date()
     await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
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
     notification.message=`Hello ${emailexsist.brandname}, an otp has been sent to your mail `
     await this.notificationrepository.save(notification)
 
     
       //send mail 
       await this.mailerservice.SendVerificationMail(newOtp.email,emiailverificationcode, emailexsist.brandname)

       return {message:'New OTP sent successfully'}
       
   }

  async Photographerchnangepassword(dto:ChangePasswordDto, customerid:string):Promise<{message:string}>{
    const photographer = await this.photographerrepository.findOne({where:{PhotographerID:customerid}})
    if (!photographer) throw new HttpException(`customer with ${customerid} does not exist and you cant be allowed to change a password`,HttpStatus.NOT_FOUND)

    //confirm the oldpassword with the saved password
    const ispasswordMatch= await this.comaprePassword(photographer.password,dto.oldPassword)
    if (!ispasswordMatch) throw new HttpException('the provided old password is not a match with the current password please provide, else you wont be allowed to perform this action', HttpStatus.NOT_ACCEPTABLE)

    //input new password 
    const newPassword= await this.hashpassword(dto.newpassword)
    photographer.password= newPassword

    //compare the new and old password 
    const isnewoldSame= await this.comaprePassword(dto.newpassword,photographer.password)
    if (isnewoldSame) throw new HttpException('your new password must be different from the old one for a stronger security',HttpStatus.NOT_ACCEPTABLE)
    await this.photographerrepository.save(photographer)

    const notification = new Notifications()
    notification.account= photographer.id,
    notification.subject="Password changed!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${photographer.brandname}, password has been succsfully chnaged `
    await this.notificationrepository.save(notification)



    return {message:"your password has been changed successfully"}

  }


  async sendPhotographerPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.photographerrepository.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= this.generatePasswordResetLink()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link=resetlink
    isEmailReistered.reset_link_exptime=expirationTime
    await this.photographerrepository.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${isEmailReistered.brandname}, password resent link sent `
    await this.notificationrepository.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async PhotographerfinallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyuser= await this.photographerrepository.findOne({where:{email:dto.email}})
    if (!verifyuser) throw new HttpException('this user is not registered on walkway',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyuser.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyuser.password=newpassword

    await this.photographerrepository.save(verifyuser)

    const notification = new Notifications()
    notification.account= verifyuser.id,
    notification.subject="New Customer!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${verifyuser.brandname}, password reset link verified and the password has been recently reseted `
    await this.notificationrepository.save(notification)


    return {message:"your password has been reset susscessfully"}
  }



  ////////////////////////////////////// model ///////////////////////////////////////////////////////
  

  async modelsignup(modeldto: kidsModeleRegistrationDto): Promise<{message:string}> {

    const dob = new Date(modeldto.dob)
    const today = new Date()
    const age =today.getFullYear() - dob.getFullYear()

    const hashedpassword = await this.hashpassword(modeldto.password);

    //pre save the model data
    const model = new ModelEntity()
    model.email=modeldto.email
    model.password=hashedpassword
    model.name=modeldto.username
    model.DOB = modeldto.dob
    model.age=age


    if (age < 1 || age > 15) {

      model.kindofmodel= KindOfModel.ADULT}
      else{

      if (!modeldto.manager || !modeldto.managerPhone){
        throw new HttpException('child model requires manager and manager\'s phone number since child is below 15',HttpStatus.BAD_REQUEST)
      }
      model.manager=modeldto.manager
      model.ManagerPhone=modeldto.managerPhone
      model.kindofmodel= KindOfModel.KID
      
    }
    model.ModelID=this.generateIdentityNumber()


    const emailexsist = await this.modelrepository.findOne({
      where: { email: modeldto.email },
      select: ['id', 'email'],
    });
    if (emailexsist)
      throw new HttpException(
        `user with email: ${modeldto.email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );

    // Check if a user with the same username already exists
    // const existingUserByUsername = await this.modelrepository.findOne({ where: { username: modeldto.username }, select: ['id', 'username'] });
    // if (existingUserByUsername) {
    //   // Generate username suggestions
    //   const suggestions = await this.generateUsernameSuggestions(modeldto.username);
    //   throw new HttpException(
    //     `Kid Model with username: ${modeldto.username} already exists. Please choose another username or consider these suggestions: ${suggestions.join(', ')}`,
    //     HttpStatus.CONFLICT,
    //   );
    // }

    await this.modelrepository.save(model)

      //2fa authentication 
      const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=modeldto.email
      otp.otp=emiailverificationcode
      otp.role= model.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('model account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,model.name)
      //  await this.mailerservice.SendMail(otp.email,subject,content)

      //save the notification 
      const notification = new Notifications()
      notification.account= model.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${model.username}, your model account has been created as a ${model.kindofmodel}. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new model signed up and verification otp has been sent "}
    
  }


  
  async Modelverifyotp(verifyotpdto:VerifyOtpdto):Promise<{isValid:boolean; accessToken:any}>{
    const findemail= await this.otprepository.findOne({where:{email:verifyotpdto.email}})
    if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
    //find the otp privided if it matches with the otp stored 
    const findotp= await this.otprepository.findOne({where:{otp:verifyotpdto.otp}})
    if (!findotp) throw new HttpException('you prided an invalid otp', HttpStatus.BAD_REQUEST)
    
    //find if the otp is expired 
    if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)

    //return valid and the access token if the user matches 

    const model = await this.modelrepository.findOne({where:{email:verifyotpdto.email}})
    if (model.email !== findemail.email) throw new HttpException("this email does not match the customer recod we have ", HttpStatus.NOT_FOUND)
    else{
      model.is_logged_in=true
      model.is_verified=true
      model.is_active=true
    

     const notification = new Notifications()
      notification.account= model.id,
      notification.subject="OTP sent!"
      notification.notification_type=NotificationType.OTP_VERIFICATION
      notification.message=`Hello ${model.name}, otp sent to this email for verification `
      await this.notificationrepository.save(notification)

      await this.mailerservice.SendWelcomeEmail(model.email,model.name)

      await this.customerrepository.save(model)

    const accessToken= await this.signToken(model.id,model.email,model.role)

    return {isValid:true, accessToken}
    }
  }

  async resendModelOtp (dto:RequestOtpResendDto):Promise<{message:string}>{
    const emailexsist = await this.modelrepository.findOne({where: { email: dto.email },select: ['id', 'email','role']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${dto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
     // Generate a new OTP
     const emiailverificationcode= generate2FACode4digits() // Your OTP generation logic

     // Save the OTP with expiration time
     const fiveminuteslater=new Date()
     await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
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
      notification.message=`Hello ${emailexsist.name}, an otp has been sent to your mail `
      await this.notificationrepository.save(notification)
 
     
       //send mail 
       await this.mailerservice.SendVerificationMail(newOtp.email,emiailverificationcode, emailexsist.name)

       return {message:'New OTP sent successfully'}
       
   }

  async Modelchnangepassword(dto:ChangePasswordDto, customerid:string):Promise<{message:string}>{
    const customer = await this.modelrepository.findOne({where:{ModelID:customerid}})
    if (!customer) throw new HttpException(`customer with ${customerid} does not exist and you cant be allowed to change a password`,HttpStatus.NOT_FOUND)

    //confirm the oldpassword with the saved password
    const ispasswordMatch= await this.comaprePassword(customer.password,dto.oldPassword)
    if (!ispasswordMatch) throw new HttpException('the provided old password is not a match with the current password please provide, else you wont be allowed to perform this action', HttpStatus.NOT_ACCEPTABLE)

    //input new password 
    const newPassword= await this.hashpassword(dto.newpassword)
    customer.password= newPassword

    //compare the new and old password 
    const isnewoldSame= await this.comaprePassword(dto.newpassword,customer.password)
    if (isnewoldSame) throw new HttpException('your new password must be different from the old one for a stronger security',HttpStatus.NOT_ACCEPTABLE)
    await this.modelrepository.save(customer)

    const notification = new Notifications()
    notification.account= customer.id,
    notification.subject="Password changed!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${customer.name}, password has been succsfully chnaged `
    await this.notificationrepository.save(notification)



    return {message:"your password has been changed successfully"}

  }


  async ModelsendPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
    const isEmailReistered= await this.modelrepository.findOne({where:{email:dto.email}})
    if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in walkway, please try another email address`,HttpStatus.NOT_FOUND)

    const resetlink= this.generatePasswordResetLink()
    const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

    //send reset link to the email provided 
    await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink)

    //save the reset link and the expiration time to the database 
    isEmailReistered.password_reset_link=resetlink
    isEmailReistered.reset_link_exptime=expirationTime
    await this.customerrepository.save(isEmailReistered)

    const notification = new Notifications()
    notification.account= isEmailReistered.id,
    notification.subject="password Reset link!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${isEmailReistered.name}, password resent link sent `
    await this.notificationrepository.save(notification)



    return {message:"the password reset link has been sent successfully"}
    
  }

  async finallyModelResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
    const verifyuser= await this.modelrepository.findOne({where:{email:dto.email}})
    if (!verifyuser) throw new HttpException('this user is not registered on walkway',HttpStatus.NOT_FOUND)

    //compare token 
    if (verifyuser.password_reset_link !== dto.resetlink) throw new HttpException('the link is incorrect please retry or request for another token',HttpStatus.NOT_ACCEPTABLE)

    //take new password 
    const newpassword= await this.hashpassword(dto.password)
    verifyuser.password=newpassword

    await this.modelrepository.save(verifyuser)

    const notification = new Notifications()
    notification.account= verifyuser.id,
    notification.subject="New Customer!"
    notification.notification_type=NotificationType.OTP_VERIFICATION
    notification.message=`Hello ${verifyuser.name}, password reset link verified and the password has been recently reseted `
    await this.notificationrepository.save(notification)


    return {message:"your password has been reset susscessfully"}
  }










  //login

  async signToken(id: string, email: string,role:string) {
    const payload = {
      sub: id,
      email,
      role
    };
    const secret = this.configservice.get('SECRETKEY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.configservice.get('EXPIRESIN'),
      secret: secret,
    });
    return { accesstoken: token };
  }


  //respective logins for various users 
  async loginCustomer(logindto: Logindto) {
    const findcustomer =await this.customerrepository.findOne({where: { email: logindto.email },})
      if (!findcustomer) throw new HttpException(`invalid credentials`,HttpStatus.UNAUTHORIZED)
      const comaprepass=await this.comaprePassword(logindto.password,findcustomer.password)
      if (!comaprepass) {
        findcustomer.login_count+=1;

     
        if (findcustomer.login_count>=5){
          findcustomer.is_locked=true
          findcustomer.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
          await this.customerrepository.save(findcustomer)
          throw new HttpException(`invalid credential`,HttpStatus.UNAUTHORIZED)
        }

        //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
      const attemptsleft= 5 - findcustomer.login_count
      await this.customerrepository.save(findcustomer)

      throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
    
      }

      if (!findcustomer.is_verified) {
        // If the account is not verified, throw an exception
        throw new ForbiddenException(
          `Your account has not been verified. Please verify your account by requesting an OTP.`
        );
      }

       //If the password matches, reset the login_count and unlock the account if needed
      findcustomer.login_count = 0;
      findcustomer.is_logged_in =true
      await this.customerrepository.save(findcustomer)

       //save the notification 
     const notification = new Notifications()
     notification.account= findcustomer.id
     notification.subject="customer logged in!"
     notification.notification_type=NotificationType.LOGGED_IN
     notification.message=`Hello ${findcustomer.username}, just logged in `
     await this.notificationrepository.save(notification)
     
      const access_token =await this.signToken(findcustomer.id,findcustomer.email,findcustomer.role)
      return access_token
  }


  async loginVendor(logindto:Logindto){
    const findvendor= await this.vendorrepository.findOne({where:{email:logindto.email}})
    if (!findvendor) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findvendor.password)
    if (!comparepass) {
      findvendor.login_count+=1;

      if (findvendor.login_count>=5){
        findvendor.is_locked=true
        findvendor.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findvendor)
        throw new HttpException(`invalid credential`,HttpStatus.UNAUTHORIZED)
      }

      //  If the vendor hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findvendor.login_count
    await this.vendorrepository.save(findvendor)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findvendor.is_verified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting an OTP.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findvendor.login_count = 0;
    findvendor.is_logged_in = true

    await this.vendorrepository.save(findvendor)


    //save the notification 
    const notification = new Notifications()
    notification.account= findvendor.id
    notification.subject="vendor logged in!"
    notification.notification_type=NotificationType.LOGGED_IN
    notification.message=`Hello ${findvendor.brandname}, just logged in `
    await this.notificationrepository.save(notification)


    return await this.signToken(findvendor.id,findvendor.email,findvendor.role)

  }

  async loginModel(logindto:Logindto){
    const findmodel= await this.modelrepository.findOne({where:{email:logindto.email}})
    if (!findmodel) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findmodel.password)
    if (!comparepass) {
      findmodel.login_count+=1;

      if (findmodel.login_count>=5){
        findmodel.is_locked=true
        findmodel.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findmodel)
        throw new HttpException(`invalid credential`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findmodel.login_count
    await this.customerrepository.save(findmodel)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findmodel.is_verified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting an OTP.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findmodel.login_count = 0;
    findmodel.is_locked = false;
    findmodel.is_logged_in = true
    await this.modelrepository.save(findmodel)

      //save the notification 
      const notification = new Notifications()
      notification.account= findmodel.id
      notification.subject="kidmodel just logged in!"
      notification.notification_type=NotificationType.LOGGED_IN
      notification.message=`Hello ${findmodel.name}, just logged in `
      await this.notificationrepository.save(notification)

    return await this.signToken(findmodel.id,findmodel.email,findmodel.role)

  }


  async loginPhotographer(logindto:Logindto){
    const findphotographer= await this.photographerrepository.findOne({where:{email:logindto.email}})
    if (!findphotographer) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findphotographer.password)
    if (!comparepass) {
      findphotographer.login_count+=1;

      if (findphotographer.login_count>=5){
        findphotographer.is_locked=true
        findphotographer.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findphotographer)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findphotographer.login_count
    await this.customerrepository.save(findphotographer)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findphotographer.is_verified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting an OTP.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findphotographer.login_count = 0;
    findphotographer.is_logged_in = true;
    await this.photographerrepository.save(findphotographer)

    //save the notification 
    const notification = new Notifications()
    notification.account= findphotographer.id
    notification.subject="Photographer just logged in!"
    notification.notification_type=NotificationType.LOGGED_IN
    notification.message=`Hello ${findphotographer.brandname}, just logged in `
    await this.notificationrepository.save(notification)

    return await this.signToken(findphotographer.id,findphotographer.email,findphotographer.role)

  }

  
  async loginAdmmin(logindto:AdminLogindto){
    const findadmin= await this.adminrepository.findOne({where:{AdminID:logindto.adminID}})
    if (!findadmin) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findadmin.password)
    if (!comparepass) {
      findadmin.login_count+=1;

      if (findadmin.login_count>=5){
        findadmin.is_locked=true
        findadmin.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findadmin)
        throw new HttpException(`invalid credential`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findadmin.login_count
    await this.customerrepository.save(findadmin)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findadmin.is_verified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting an OTP.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findadmin.login_count = 0;
    findadmin.is_logged_in = true;
    await this.adminrepository.save(findadmin)

    //save the notification 
    const notification = new Notifications()
    notification.account= findadmin.id
    notification.subject="Admin user just logged in!"
    notification.notification_type=NotificationType.LOGGED_IN
    notification.message=`Hello ${findadmin.username}, just logged in `
    await this.notificationrepository.save(notification)

    
    return await this.signToken(findadmin.id,findadmin.email,findadmin.role)

  }

  
  async validateUserById(id: string, role: string) {
    switch (role) {
      case 'admin':
        return await this.adminrepository.findOne({where:{id:id}});
      case 'vendor':
        return await this.vendorrepository.findOne({where:{id:id}});
      case 'customer':
        return await this.customerrepository.findOne({where:{id:id}});
      case 'model':
        return await this.modelrepository.findOne({where:{id:id}});
      case 'photographer':
        return await this.photographerrepository.findOne({where:{id:id}});
      default:
        return null; // Invalid role
    }
  }


  ///logout routes 
  


}
