import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdinaryUserEntity } from '../Entity/users/ordinaryuser.entity';
import {
  FashionDesignerRepository,
  FashionModelRepository,
  FootwearModelRepository,
  HairModelRepository,
  KidsModelRepository,
  MakeUpModelRepository,
  OrdinaryUserRepository,
  PhotographerRepository,
  SkincareModelRepository,
} from './auth.repository';
import { FashionDesignerEntity } from '../Entity/users/fashiodesigner.entity';
import { PhotographerEntity } from '../Entity/users/photographers.entity';
import { FashionModelsEntity } from '../Entity/users/BrandModelsUsers/fashionmodels.entity';
import { HairModelsEntity } from '../Entity/users/BrandModelsUsers/hairmodels.entity';
import { SkincareModelsEntity } from '../Entity/users/BrandModelsUsers/skincaremodels.entity';
import { FootwearModelsEntity } from '../Entity/users/BrandModelsUsers/footwaremodels.entity';
import { KidsModelsEntity } from '../Entity/users/BrandModelsUsers/kidsmodels.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  RegistrationDto,
  UserRegistrationDto,
  kidsModeleRegistrationDto,
} from './dto/registrationdto';
import { ConfigService } from '@nestjs/config';
import { Logindto } from './dto/logindto';
import { MakeUpModelsEntity } from '../Entity/users/BrandModelsUsers/makeupmodels.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OrdinaryUserEntity)
    private ordnaryuserrepository: OrdinaryUserRepository,
    @InjectRepository(FashionDesignerEntity)
    private fashiondesigerrepository: FashionDesignerRepository,
    @InjectRepository(PhotographerEntity)
    private photographerrepository: PhotographerRepository,
    @InjectRepository(FashionModelsEntity)
    private fashionmodelrepository: FashionModelRepository,
    @InjectRepository(HairModelsEntity)
    private hairmodelrepository: HairModelRepository,
    @InjectRepository(SkincareModelsEntity)
    private skincaremodelrepository: SkincareModelRepository,
    @InjectRepository(FootwearModelsEntity)
    private footwearrepository: FootwearModelRepository,
    @InjectRepository(KidsModelsEntity)
    private kidsmodelrepository: KidsModelRepository,
    @InjectRepository(MakeUpModelsEntity)
    private makeuprepository: MakeUpModelRepository,
    private jwt: JwtService,
    private configservice: ConfigService,
  ) {}

  async hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comaprePassword(userpassword,dbpassword): Promise<boolean> {
    return await bcrypt.compare(userpassword,dbpassword);
  }

  ///signup for various users

  async ordinaryusersignup(
    userdto: UserRegistrationDto,
  ): Promise<OrdinaryUserEntity> {
    const { email, password, name } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.ordnaryuserrepository.save({
      email,
      password: hashedpassword,
      name,
    });
  }

  async fashiondesignersignup(
    userdto: UserRegistrationDto,
  ): Promise<FashionDesignerEntity> {
    const { email, password, name } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.fashiondesigerrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.fashiondesigerrepository.save({
      email,
      password: hashedpassword,
      name,
    });
  }

  async photographersignup(
    userdto: RegistrationDto,
  ): Promise<PhotographerEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.photographerrepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async fashionmodelsignup(
    userdto: RegistrationDto,
  ): Promise<FashionModelsEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.fashionmodelrepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async hairmodelsignup(userdto: RegistrationDto): Promise<HairModelsEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.hairmodelrepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async skincaremodelsignup(
    userdto: RegistrationDto,
  ): Promise<SkincareModelsEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.skincaremodelrepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async footwearsignup(
    userdto: RegistrationDto,
  ): Promise<FootwearModelsEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.footwearrepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async makeupmodelignup(
    userdto: RegistrationDto,
  ): Promise<MakeUpModelsEntity> {
    const { email, password, username } = userdto;
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.makeuprepository.save({
      email,
      password: hashedpassword,
      username,
    });
  }

  async kidsmodelsignup(
    userdto: kidsModeleRegistrationDto,
  ): Promise<KidsModelsEntity> {
    const { email, password, username, manager, ManagerPhone, age } = userdto;
    if (age < 1 || age > 12) {
      throw new HttpException(
        `Kid's age must be between 1 and 12 years old`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedpassword = await this.hashpassword(password);
    const emailexsist = this.ordnaryuserrepository.findOne({
      where: { email: email },
      select: ['id', 'email'],
    });
    if (!emailexsist)
      throw new HttpException(
        `user with email: ${email} exists, please use another unique email`,
        HttpStatus.CONFLICT,
      );
    return await this.kidsmodelrepository.save({
      email,
      password: hashedpassword,
      username,
      manager,
      ManagerPhone,
      age,
    });
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
      (await this.ordnaryuserrepository.findOne({
        where: { email: logindto.email },
      })) 
      ||
      (await this.fashiondesigerrepository.findOne({
        where: { email: logindto.email },
      })) ||
      (await this.photographerrepository.findOne({
        where: { email: logindto.email },
      }))  ||
      (await this.fashionmodelrepository.findOne({
        where: { email: logindto.email },
      })) ||
      (await this.footwearrepository.findOne({
        where: { email: logindto.email },
      })) ||
      (await this.hairmodelrepository.findOne({
        where: { email: logindto.email },
      })) ||
      (await this.skincaremodelrepository.findOne({
        where: { email: logindto.email },
      })) ||
      (await this.kidsmodelrepository.findOne({
        where: { email: logindto.email },
      }));

      if (!finduser) throw new HttpException(`invalid email address`,HttpStatus.UNAUTHORIZED)

      const comaprepass=await this.comaprePassword(logindto.password,finduser.password)
      if (!comaprepass) throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      
      return await this.signToken(finduser.id,finduser.email)
  }
}
