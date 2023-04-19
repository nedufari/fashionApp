import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm"
import { Migration } from "typeorm";
import { FashionDesignerEntity } from "../Entity/users/fashiodesigner.entity";
import { OrdinaryUserEntity } from "../Entity/users/ordinaryuser.entity";
import { FashionModelsEntity } from "../Entity/users/BrandModelsUsers/fashionmodels.entity";
import { FashionDesignerPostsEntity } from "../Entity/Posts/fd.post";
import { FashionMdodelPostsEtity } from "../Entity/Posts/brandmodelsPosts/fashionModel.posts";
import { PhotographerEntity } from "../Entity/users/photographers.entity";
import { PhotographerPostsEntity } from "../Entity/Posts/photographer.posts";
import { KidsMdodelPostsEntity } from "../Entity/Posts/brandmodelsPosts/kidsmodel.posts";
import { KidsModelsEntity } from "../Entity/users/BrandModelsUsers/kidsmodels.entity";
import { FootwareMdodelPostsEntity } from "../Entity/Posts/brandmodelsPosts/footwareModel.posts";
import { FootwearModelsEntity } from "../Entity/users/BrandModelsUsers/footwaremodels.entity";
import { SkincareModelsEntity } from "../Entity/users/BrandModelsUsers/skincaremodels.entity";
import { SkinCareMdodelPostsEntity } from "../Entity/Posts/brandmodelsPosts/skincaremodel.posts";
import { HairMdodelPostsEntity } from "../Entity/Posts/brandmodelsPosts/hairmodels.posts";
import { HairModelsEntity } from "../Entity/users/BrandModelsUsers/hairmodels.entity";
import { MakeUpModelsEntity } from "../Entity/users/BrandModelsUsers/makeupmodels.entity";
import { MakeUpMdodelPostsEntity } from "../Entity/Posts/brandmodelsPosts/makeupmodels.posts";
import { Contracts } from "../Entity/Actions/contracts.entity";

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory{
    constructor(private configservice:ConfigService){
    }

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type:'postgres',
            host:this.configservice.get('DATABASE_HOST'),
            port:this.configservice.get('DATABASE_PORT'),
            username:this.configservice.get('DATABASE_USERNAME'),
            password:String(this.configservice.get('DATABASE_PASSWORD')),
            database:this.configservice.get('DATABASE_NAME'),
            synchronize:true,
            logging:false,
            entities:[FashionDesignerEntity, OrdinaryUserEntity, FashionModelsEntity, FashionDesignerPostsEntity,FashionMdodelPostsEtity, PhotographerEntity,PhotographerPostsEntity,KidsMdodelPostsEntity,KidsModelsEntity,FootwareMdodelPostsEntity,FootwearModelsEntity,SkincareModelsEntity,SkinCareMdodelPostsEntity,HairMdodelPostsEntity,HairModelsEntity,MakeUpModelsEntity,MakeUpMdodelPostsEntity,Contracts],
            migrations:[],
            subscribers:[],

        }
        
    }

}