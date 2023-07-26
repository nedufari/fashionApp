import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {RegistrationDto,kidsModeleRegistrationDto,} from './dto/registrationdto';
import { ConfigService } from '@nestjs/config';
import { Logindto } from './dto/logindto';
import { AdminEntityRepository, CustomerEntityRepository, ModelEntityRepository, NotificationsRepository, OtpRepository, PhotographerEntityRepository, VendorEntityRepository } from './auth.repository';
import { IAdminResponse } from '../Users/admin/admin.interface';
import { ICustomerResponse } from '../Users/customers/customers.interface';
import { generate2FACode6digits } from '../helpers';
import { UserOtp } from '../Entity/userotp.entity';
import { MailService } from '../mailer.service';
import { Notifications } from '../Entity/Notification/notification.entity';
import { NotificationType } from '../Enums/notificationTypes.enum';
import { AdminEntity } from '../Entity/Users/admin.entity';
import { CustomerEntity } from '../Entity/Users/customer.entity';
import { vendorEntity } from '../Entity/Users/vendor.entity';
import { ModelEntity } from '../Entity/Users/model.entity';
import { PhotographerEntity } from '../Entity/Users/photorapher.entity';


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


  ///signup for various users

  async CustomerSignup(userdto: RegistrationDto,): Promise<{message:string}> {
    try {
      const { email, password, username,} = userdto;
      const hashedpassword = await this.hashpassword(password);
      const emailexsist = this.customerrepository.findOne({where: { email: email },select: ['id', 'email']});
      if (!emailexsist)
        throw new HttpException(
          `user with email: ${email} exists, please use another unique email`,
          HttpStatus.CONFLICT,
        );
        await this.customerrepository.save({email,password: hashedpassword,username,});

      //2fa authentication 
      const emiailverificationcode= generate2FACode6digits()

      const otp= new UserOtp()
      otp.email=userdto.email
      otp.otp=emiailverificationcode
      otp.role=(await emailexsist).role
      const fiveminuteslater=new Date()
      await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+5)
      otp.expiration_time=fiveminuteslater
      await this.otprepository.create()
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
      await this.mailerservice.SendMail(otp.email,subject,content)

      //save the notification 
      const notification = new Notifications()
      notification.account= (await emailexsist).id
      notification.subject="New Customer!"
      notification.notification_type=NotificationType.SIGNED_UP
      notification.message=`Hello ${(await emailexsist).username}, your customer has been created. please complete your profile `
      await this.notificationrepository.create()

      return {message:"new coustomer signed up and verification otp has been sent "}
    
    } catch (error) {
      throw new HttpException(`user sign up failed`,HttpStatus.BAD_REQUEST)
      
    }

   
  }

  

  // async kidsmodelsignup(
  //   userdto: kidsModeleRegistrationDto,
  // ): Promise<KidsModelsEntity> {
  //   const { email, password, username, manager, ManagerPhone, age } = userdto;
  //   if (age < 1 || age > 12) {
  //     throw new HttpException(
  //       `Kid's age must be between 1 and 12 years old`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const hashedpassword = await this.hashpassword(password);
  //   const emailexsist = this.ordnaryuserrepository.findOne({
  //     where: { email: email },
  //     select: ['id', 'email'],
  //   });
  //   if (!emailexsist)
  //     throw new HttpException(
  //       `user with email: ${email} exists, please use another unique email`,
  //       HttpStatus.CONFLICT,
  //     );
  //   return await this.kidsmodelrepository.save({
  //     email,
  //     password: hashedpassword,
  //     username,
  //     manager,
  //     ManagerPhone,
  //     age,
  //   });
  // }



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
