import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {AdultModelRegistrationDto, RegistrationDto,VendorRegistrationDto,kidsModeleRegistrationDto,} from './dto/registrationdto';
import { ConfigService } from '@nestjs/config';
import { Logindto } from './dto/logindto';
import { AdminEntityRepository, CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository } from './auth.repository';
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
import { nanoid } from 'nanoid';


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
    private configservice: ConfigService,
    private mailerservice:MailService
  ) {}

  async hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comaprePassword(userpassword,dbpassword): Promise<boolean> {
    return await bcrypt.compare(userpassword,dbpassword);
  }

  private generateIdentityNumber():string{
    return nanoid(8)
  }


  ///signup for various users


  async AdminSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const admin = new AdminEntity()
      admin.email=userdto.email
      admin.password=hashedpassword
      admin.username=userdto.username
      admin.AdminID=this.generateIdentityNumber()
      
      const emailexsist = this.adminrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
        await this.customerrepository.save(admin);

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

      return {message:"new coustomer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }


  async CustomerSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const customer = new CustomerEntity()
      customer.email=userdto.email
      customer.password=hashedpassword
      customer.username=userdto.username
      customer.CustomerID=this.generateIdentityNumber()
      
      const emailexsist = this.customerrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
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

      await this.mailerservice.SendWelcomeEmail(customer.email,customer.username)

      return {message:"new coustomer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }


  /// new vendor 
  async VendorSignup(userdto: VendorRegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const vendor = new vendorEntity()
      vendor.email=userdto.email
      vendor.password=hashedpassword
      vendor.brandname=userdto.brandname
      vendor.VendorID=this.generateIdentityNumber()
      
      const emailexsist = this.vendorrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
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


  //photographer 
  async PhotographerSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const hashedpassword = await this.hashpassword(userdto.password);
      const customer = new PhotographerEntity()
      customer.email=userdto.email
      customer.password=hashedpassword
      customer.username=userdto.username
      customer.PhotographerID=this.generateIdentityNumber()
      
      const emailexsist = this.photographerrepository.findOne({where: { email: userdto.email },select: ['id', 'email']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${userdto.email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
        await this.photographerrepository.save(customer);

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

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,customer.username)

      //save the notification 
      const notification = new Notifications()
      notification.account= customer.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${customer.username}, your photographer account has been created. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new Photographer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw error
      // throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }
  

  async kidsmodelsignup(kiddto: kidsModeleRegistrationDto): Promise<{message:string}> {
    
    if (kiddto.age < 1 || kiddto.age > 15) {
      throw new HttpException(`Kid's age must be between 1 and 15 years old`,HttpStatus.BAD_REQUEST,);}
    const hashedpassword = await this.hashpassword(kiddto.password);
    const emailexsist = this.modelrepository.findOne({
      where: { email: kiddto.email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${kiddto.email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );

    const kid = new ModelEntity()
    kid.email=kiddto.email
    kid.password=hashedpassword
    kid.username=kiddto.username
    kid.manager=kiddto.manager
    kid.ManagerPhone=kiddto.ManagerPhone
    kid.age=kiddto.age
    kid.kindofmodel=kiddto.kindofmodel
    kid.ModelID=this.generateIdentityNumber()
    await this.modelrepository.save(kid)

      //2fa authentication 
      const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=kiddto.email
      otp.otp=emiailverificationcode
      otp.role= kid.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('customer account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,kid.username)
      //  await this.mailerservice.SendMail(otp.email,subject,content)

      //save the notification 
      const notification = new Notifications()
      notification.account= kid.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${kid.username}, your kid model account has been created as a ${kid.kindofmodel}. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new Photographer signed up and verification otp has been sent "}
    
  }

  async Adultmodelsignup(adultdto: AdultModelRegistrationDto): Promise<{message:string}> {
    
    
    const hashedpassword = await this.hashpassword(adultdto.password);
    const emailexsist = this.modelrepository.findOne({
      where: { email: adultdto.email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${adultdto.email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );

    const adult = new ModelEntity()
    adult.email=adultdto.email
    adult.password=hashedpassword
    adult.username=adultdto.username
    adult.kindofmodel=adultdto.kindofmodel
    adult.ModelID=this.generateIdentityNumber()
   
    await this.modelrepository.save(adult)

      //2fa authentication 
      const emiailverificationcode= generate2FACode4digits()

      const otp= new UserOtp()
      otp.email=adultdto.email
      otp.otp=emiailverificationcode
      otp.role= adult.role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.save(otp)
      console.log('model account created please check your mail to verify your account, by inputing the six digit OTP sent to you')

      //send mail 
      await this.mailerservice.SendVerificationMail(otp.email,emiailverificationcode,adult.username)

      //save the notification 
      const notification = new Notifications()
      notification.account= adult.id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${adult.username}, your kid model account has been created as an ${adult.kindofmodel}. please complete your profile `
      await this.notificationrepository.save(notification)

      return {message:"new Photographer signed up and verification otp has been sent "}
    
  }














  //login

  async signToken(id: string, email: string) {
    const payload = {
      sub: id,
      email,
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
      if (!findcustomer) throw new HttpException(`invalid email address`,HttpStatus.UNAUTHORIZED)
      const comaprepass=await this.comaprePassword(logindto.password,findcustomer.password)
      if (!comaprepass) {
        findcustomer.login_count+=1;

        if (findcustomer.login_count>=5){
          findcustomer.is_locked=true
          findcustomer.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
          await this.customerrepository.save(findcustomer)
          throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
        }

        //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
      const attemptsleft= 5 - findcustomer.login_count
      await this.customerrepository.save(findcustomer)

      throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
    
      }

       //If the password matches, reset the login_count and unlock the account if needed
      findcustomer.login_count = 0;
      findcustomer.is_locked = false;
     
      const access_token =await this.signToken(findcustomer.id,findcustomer.email)
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
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the vendor hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findvendor.login_count
    await this.customerrepository.save(findvendor)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findvendor.login_count = 0;
    findvendor.is_locked = false;


    return await this.signToken(findvendor.id,findvendor.email)

  }

  async loginKidModel(logindto:Logindto){
    const findkid= await this.modelrepository.findOne({where:{email:logindto.email}})
    if (!findkid) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findkid.password)
    if (!comparepass) {
      findkid.login_count+=1;

      if (findkid.login_count>=5){
        findkid.is_locked=true
        findkid.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findkid)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findkid.login_count
    await this.customerrepository.save(findkid)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findkid.login_count = 0;
    findkid.is_locked = false;
    return await this.signToken(findkid.id,findkid.email)

  }

  async loginAdultModel(logindto:Logindto){
    const findadult= await this.modelrepository.findOne({where:{email:logindto.email}})
    if (!findadult) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findadult.password)
    if (!comparepass) {
      findadult.login_count+=1;

      if (findadult.login_count>=5){
        findadult.is_locked=true
        findadult.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findadult)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findadult.login_count
    await this.customerrepository.save(findadult)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findadult.login_count = 0;
    findadult.is_locked = false;
    return await this.signToken(findadult.id,findadult.email)

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

     //If the password matches, reset the login_count and unlock the account if needed
    findphotographer.login_count = 0;
    findphotographer.is_locked = false;
    return await this.signToken(findphotographer.id,findphotographer.email)

  }

  
  async loginAdmmin(logindto:Logindto){
    const findadmin= await this.adminrepository.findOne({where:{email:logindto.email}})
    if (!findadmin) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findadmin.password)
    if (!comparepass) {
      findadmin.login_count+=1;

      if (findadmin.login_count>=5){
        findadmin.is_locked=true
        findadmin.is_locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.customerrepository.save(findadmin)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findadmin.login_count
    await this.customerrepository.save(findadmin)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findadmin.login_count = 0;
    findadmin.is_locked = false;
    return await this.signToken(findadmin.id,findadmin.email)

  }

  


  ///logout routes 
  


}
