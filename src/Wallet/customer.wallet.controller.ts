import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CustomerWalletService } from "./customer.wallet.service";
import { IWallet, IWalletResponse } from "../Entity/wallet/wallet.entity";
import { CreateWalletDto } from "./wallet.dto";
import { JwtGuard } from "../auth/guards/jwt.guards";

@UseGuards(JwtGuard)
@Controller('wallet')
export class CustomerWalletController{
    constructor(private readonly customerwalletservice:CustomerWalletService){}

    @Post('customer/create/:id')
    async createwallet(@Param('id')id:string,@Body()walletdto:CreateWalletDto,@Req()request):Promise<IWalletResponse>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== id) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const wallet = await this.customerwalletservice.createWallet(id,walletdto)
        return wallet
    }

    @Get('mywallet/:walletid/:customerid')
    async getMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<IWalletResponse>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.customerwalletservice.fetchMywallet(walletid,customerid)
        return mywallet
    }

    @Delete('delete/mywallet/:walletid/:customerid')
    async DeleteMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<{message:string}>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.customerwalletservice.deleteMyWallet(walletid,customerid)
        return mywallet
    }
}