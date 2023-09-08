import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { Wallet } from "../Entity/wallet/wallet.entity";
import { CustomerWalletService } from "./customer.wallet.service";
import { CustomerWalletController } from "./customer.wallet.controller";
import { Notifications } from "../Entity/Notification/notification.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,Wallet,Notifications,vendorEntity,ModelEntity,PhotographerEntity])],
    providers:[CustomerWalletService],
    controllers:[CustomerWalletController]
})
export class WalletModule{}