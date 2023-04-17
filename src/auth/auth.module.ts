import { Module } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/role.guards';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FashionDesignerEntity } from '../Entity/users/fashiodesigner.entity';
import { OrdinaryUserEntity } from '../Entity/users/ordinaryuser.entity';
import { PhotographerEntity } from '../Entity/users/photographers.entity';
import { FootwearModelsEntity } from '../Entity/users/BrandModelsUsers/footwaremodels.entity';
import { HairModelsEntity } from '../Entity/users/BrandModelsUsers/hairmodels.entity';
import { KidsModelsEntity } from '../Entity/users/BrandModelsUsers/kidsmodels.entity';
import { FashionModelsEntity } from '../Entity/users/BrandModelsUsers/fashionmodels.entity';
import { SkincareModelsEntity } from '../Entity/users/BrandModelsUsers/skincaremodels.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [JwtGuard, RolesGuard, JwtStrategy, AuthService],
  exports:[],
  imports: [
    TypeOrmModule.forFeature([
      FashionDesignerEntity,
      OrdinaryUserEntity,
      PhotographerEntity,
      FootwearModelsEntity,
      HairModelsEntity,
      KidsModelsEntity,
      FashionModelsEntity,
      SkincareModelsEntity,
    ]),
    JwtModule.registerAsync({
        useFactory:()=>({
            secret:process.env.SECRETKEY,
            signOptions:{expiresIn:"3600s"}
            
        })
    })
  ],
  controllers: [AuthController],
})
export class AuthModule {}
