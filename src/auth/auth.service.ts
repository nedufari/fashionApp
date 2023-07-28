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
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@Bubbles.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
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

      //send mail 
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@Bubbles.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
      //  await this.mailerservice.SendMail(otp.email,subject,content)

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
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@NedFashion.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
      //  await this.mailerservice.SendMail(otp.email,subject,content)

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
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@Bubbles.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
      //  await this.mailerservice.SendMail(otp.email,subject,content)

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
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@Bubbles.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
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
      const subject="verify your email"
      const content=`<p>
      To complete your onboarding, use the following OTP code
    </p>
    <p>
    for verification
    </p>

    <p>
    <strong>
        OTP: ${emiailverificationcode}
    </strong>
    </p>

    <p>
      The code expires in five minutes.
      If you did not initiate this action, please send an email to
      support@Bubbles.com
    </p>

    <p>
      Best,
      The Bubbles team.
    </p>`
      //  await this.mailerservice.SendMail(otp.email,subject,content)

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

  async login(logindto: Logindto) {
    const finduser =
      (await this.customerrepository.findOne({
        where: { email: logindto.email },
      })) 

      if (!finduser) throw new HttpException(`invalid email address`,HttpStatus.UNAUTHORIZED)

      const comaprepass=await this.comaprePassword(logindto.password,finduser.password)
      if (!comaprepass) throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      
      return await this.signToken(finduser.id,finduser.email)
  }
}
