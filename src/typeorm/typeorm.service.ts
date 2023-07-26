import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm"
import { AdminEntity } from "../Entity/Users/admin.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { Comments } from "../Entity/Activities/comment.entity";
import { Likes } from "../Entity/Activities/likes.entity";
import { Replies } from "../Entity/Activities/reply.entity";
import { UserOtp } from "../Entity/userotp.entity";
import { Notifications } from "../Entity/Notification/notification.entity";
import { Contracts } from "../Entity/contracts.entity";

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
            entities:[ AdminEntity,ModelEntity,PhotographerEntity,vendorEntity,CustomerEntity,Comments,Likes,Replies,UserOtp,Notifications,Contracts],
            migrations:[],
            subscribers:[],

        }
        
    }

}