import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto, UserRegistrationDto, kidsModeleRegistrationDto } from './dto/registrationdto';
import { OrdinaryUserEntity } from '../Entity/users/ordinaryuser.entity';
import { FashionDesignerEntity } from '../Entity/users/fashiodesigner.entity';
import { PhotographerEntity } from '../Entity/users/photographers.entity';
import { HairModelsEntity } from '../Entity/users/BrandModelsUsers/hairmodels.entity';
import { FootwearModelsEntity } from '../Entity/users/BrandModelsUsers/footwaremodels.entity';
import { SkincareModelsEntity } from '../Entity/users/BrandModelsUsers/skincaremodels.entity';
import { KidsModelsEntity } from '../Entity/users/BrandModelsUsers/kidsmodels.entity';
import { FashionModelsEntity } from '../Entity/users/BrandModelsUsers/fashionmodels.entity';
import { Logindto } from './dto/logindto';
import { MakeUpModelsEntity } from '../Entity/users/BrandModelsUsers/makeupmodels.entity';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    @Post('ordinaryuser')
    async ordiaryusersignup(@Body()dto:UserRegistrationDto):Promise<OrdinaryUserEntity>{
        return await this.authservice.ordinaryusersignup(dto)
    }

    @Post('fashiondesigner')
    async fashiondesignersignup(@Body()dto:UserRegistrationDto):Promise<FashionDesignerEntity>{
        return await this.authservice.fashiondesignersignup(dto)
    }

    @Post('photographer')
    async photographersignup(@Body()dto:RegistrationDto):Promise<PhotographerEntity>{
        return await this.authservice.photographersignup(dto)
    }

    @Post('hairmodel')
    async hairmodelsignup(@Body()dto:RegistrationDto):Promise<HairModelsEntity>{
        return await this.authservice.hairmodelsignup(dto)
    }

    @Post('footwear')
    async footwearsignup(@Body()dto:RegistrationDto):Promise<FootwearModelsEntity>{
        return await this.authservice.footwearsignup(dto)
    }

    @Post('skincare')
    async skincaresignup(@Body()dto:RegistrationDto):Promise<SkincareModelsEntity>{
        return await this.authservice.skincaremodelsignup(dto)
    }

    @Post('kidmodel')
    async kidssignup(@Body()dto:kidsModeleRegistrationDto):Promise<KidsModelsEntity>{
        return await this.authservice.kidsmodelsignup(dto)
    }

    @Post('ordinaryuser')
    async fashionmodelssignup(@Body()dto:RegistrationDto):Promise<FashionModelsEntity>{
        return await this.authservice.fashionmodelsignup(dto)
    }
    @Post('ordinaryuser')
    async makeupmodelssignup(@Body()dto:RegistrationDto):Promise<MakeUpModelsEntity>{
        return await this.authservice.makeupmodelignup(dto)
    }

    @Post("login")
    async login(@Body()logindto:Logindto){
        return await this.authservice.login(logindto)
    }
}
