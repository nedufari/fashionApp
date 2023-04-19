import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FashionDesignerService } from './fashiondesigner.service';
import { fashiondesignercontroller } from './fashiondesigner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FashionDesignerEntity } from '../Entity/users/fashiodesigner.entity';
import { PhotographerEntity } from '../Entity/users/photographers.entity';
import { FashionModelsEntity } from '../Entity/users/BrandModelsUsers/fashionmodels.entity';
import { FootwearModelsEntity } from '../Entity/users/BrandModelsUsers/footwaremodels.entity';
import { HairModelRepository } from '../auth/auth.repository';
import { SkincareModelsEntity } from '../Entity/users/BrandModelsUsers/skincaremodels.entity';
import { KidsModelsEntity } from '../Entity/users/BrandModelsUsers/kidsmodels.entity';
import { MakeUpModelsEntity } from '../Entity/users/BrandModelsUsers/makeupmodels.entity';
import { OrdinaryUserEntity } from '../Entity/users/ordinaryuser.entity';
import { HairModelsEntity } from '../Entity/users/BrandModelsUsers/hairmodels.entity';
import { Contracts } from '../Entity/Actions/contracts.entity';

@Module({
    imports:[AuthModule,TypeOrmModule.forFeature([FashionDesignerEntity,PhotographerEntity,FashionModelsEntity,FootwearModelsEntity,HairModelsEntity,SkincareModelsEntity,KidsModelsEntity,MakeUpModelsEntity,OrdinaryUserEntity,Contracts])],
    providers:[FashionDesignerService],
    controllers:[fashiondesignercontroller]
})
export class FashionDesignersModule {}
