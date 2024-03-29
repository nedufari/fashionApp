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
import { VendorPostsEntity } from "../Entity/Posts/vendor.post.entity";
import { ContractsOfffer } from "../Entity/contractoffer.entity";
import { CounterContractsOfffer } from "../Entity/countercontractOffer.entity";
import { Wallet } from "../Entity/wallet/wallet.entity";
import { ModelTimelineEntity } from "../Entity/Posts/model.timeline.entity";
import { PhotographerTimelineEntity } from "../Entity/Posts/photographer.timeline.entity";
import { CustomerCartEntity } from "../Entity/Cart/customer.cart.entity";
import { CustomerCartItemEntity } from "../Entity/Cart/customer.cartitem.entity";
import { VendorProducts } from "../Entity/VendorProducts/vendor.products.entity";
import { ComplaintsEntity } from "../Entity/Activities/complaints.entity";

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
            entities:[ AdminEntity,ModelEntity,PhotographerEntity,vendorEntity,CustomerEntity,Comments,Likes,Replies,UserOtp,Notifications,Contracts,VendorPostsEntity,ContractsOfffer,CounterContractsOfffer,Wallet,ModelTimelineEntity,PhotographerTimelineEntity,CustomerCartEntity,CustomerCartItemEntity,VendorProducts,ComplaintsEntity],
            migrations:[],
            subscribers:[],

        }
        
    }

}