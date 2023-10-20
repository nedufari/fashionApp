import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { Wallet } from "../Entity/wallet/wallet.entity";

import { Notifications } from "../Entity/Notification/notification.entity";
import { vendorEntity } from "../Entity/Users/vendor.entity";
import { ModelEntity } from "../Entity/Users/model.entity";
import { PhotographerEntity } from "../Entity/Users/photorapher.entity";
import { WebhookService } from "./webhook/webhook.service";
import { WebhookController } from "./webhook/webhook.controller";
import { UserWalletService } from "./users.wallet.service";
import { SharedInitializeService } from "./shared.wallets.service";
import { UserWalletController } from "./users.wallet.controller";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,Wallet,Notifications,vendorEntity,ModelEntity,PhotographerEntity])],
    providers:[UserWalletService,WebhookService,SharedInitializeService],
    controllers:[WebhookController,UserWalletController],
    exports:[WebhookService]
})
export class WalletModule{}