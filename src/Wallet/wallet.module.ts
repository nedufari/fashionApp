import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { Wallet } from "../Entity/wallet/wallet.entity";
import { CustomerWalletService } from "./customer.wallet.service";
import { CustomerWalletController } from "./customer.wallet.controller";

@Module({
    imports:[TypeOrmModule.forFeature([CustomerEntity,Wallet])],
    providers:[CustomerWalletService],
    controllers:[CustomerWalletController]
})
export class WalletModule{}