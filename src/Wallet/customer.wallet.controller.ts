import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CustomerWalletService } from "./customer.wallet.service";
import { IWallet, IWalletResponse } from "../Entity/wallet/wallet.entity";
import { CreateWalletDto } from "./wallet.dto";

@Controller('wallet')
export class CustomerWalletController{
    constructor(private readonly customerwalletservice:CustomerWalletService){}

    @Post('customer/create/:id')
    async createwallet(@Param('id')id:string,@Body()walletdto:CreateWalletDto):Promise<IWalletResponse>{
        const wallet = await this.customerwalletservice.createWallet(id,walletdto)
        return wallet
    }

    @Get('mywallet/:walletid/:customerid')
    async getMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string):Promise<IWalletResponse>{
        const mywallet =await this.customerwalletservice.fetchMywallet(walletid,customerid)
        return mywallet
    }

    @Delete('delete/mywallet/:walletid/:customerid')
    async DeleteMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string):Promise<{message:string}>{
        const mywallet =await this.customerwalletservice.deleteMyWallet(walletid,customerid)
        return mywallet
    }
}