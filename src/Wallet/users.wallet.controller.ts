import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UserWalletService } from "./users.wallet.service";
import { IWallet, IWalletResponse, IWalletResponseModel } from "../Entity/wallet/wallet.entity";
import { CreateWalletDto, InitializeFundingDto } from "./wallet.dto";
import { JwtGuard } from "../auth/guards/jwt.guards";
import { SharedInitializeService } from "./shared.wallets.service";

//@UseGuards(JwtGuard)
@Controller('wallet')
export class UserWalletController{
    constructor(private readonly userwalletservice:UserWalletService,
      private readonly sharedInitialize:SharedInitializeService){}


    //for customers 


    @Post('customer/create/:id')
    async Customercreatewallet(@Param('id')id:string,@Body()walletdto:CreateWalletDto,@Req()request):Promise<IWalletResponseModel>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== id) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const wallet = await this.userwalletservice.CustomercreateWallet(id,walletdto)
        return wallet
    }

    @Get('customer/mywallet/:walletid/:customerid')
    async CustomergetMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<IWalletResponseModel>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.userwalletservice.CustomerfetchMywallet(walletid,customerid)
        return mywallet
    }

    @Delete('customer/delete/mywallet/:walletid/:customerid')
    async CustomerDeleteMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<{message:string}>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.userwalletservice.CustomerdeleteMyWallet(walletid,customerid)
        return mywallet
    }



    
    //for photographers

    @Post('photographer/create/:id')
    async Photographercreatewallet(@Param('id')id:string,@Body()walletdto:CreateWalletDto,@Req()request):Promise<IWalletResponse>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== id) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const wallet = await this.userwalletservice.PhotographercreateWallet(id,walletdto)
        return wallet
    }

    @Get('photographer/mywallet/:walletid/:customerid')
    async PhotographergetMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<IWalletResponse>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.userwalletservice.PhotographerfetchMywallet(walletid,customerid)
        return mywallet
    }

    @Delete('photographer/delete/mywallet/:walletid/:customerid')
    async PhotographerDeleteMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<{message:string}>{
        const userIdFromToken = await request.user.id; 
      console.log(request.user.email)
  
      if (userIdFromToken !== customerid) {
      throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
      }
        const mywallet =await this.userwalletservice.PhotographerdeleteMyWallet(walletid,customerid)
        return mywallet
    }


     //for models

     @Post('model/create/:id')
     async Modelcreatewallet(@Param('id')id:string,@Body()walletdto:CreateWalletDto,@Req()request):Promise<IWalletResponseModel>{
         const userIdFromToken = await request.user.id; 
       console.log(request.user.email)
   
       if (userIdFromToken !== id) {
       throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
       }
         const wallet = await this.userwalletservice.ModelcreateWallet(id,walletdto)
         return wallet
     }
 
     @Get('model/mywallet/:walletid/:customerid')
     async ModelgetMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<IWalletResponseModel>{
         const userIdFromToken = await request.user.id; 
       console.log(request.user.email)
   
       if (userIdFromToken !== customerid) {
       throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
       }
         const mywallet =await this.userwalletservice.ModelfetchMywallet(walletid,customerid)
         return mywallet
     }
 
     @Delete('model/delete/mywallet/:walletid/:customerid')
     async ModelDeleteMyWallet(@Param('walletid')walletid:string, @Param('customerid')customerid:string,@Req()request):Promise<{message:string}>{
         const userIdFromToken = await request.user.id; 
       console.log(request.user.email)
   
       if (userIdFromToken !== customerid) {
       throw new ForbiddenException("You are not authorized to perform this action on another user's account.");
       }
         const mywallet =await this.userwalletservice.ModeldeleteMyWallet(walletid,customerid)
         return mywallet
     }


     //shared activities 

     //itinitializepayment 
     @Post('initialize-payment')
     async InitializePayment(@Body()dto:InitializeFundingDto):Promise<void>{
      const fund = await this.sharedInitialize.InitilizeFunding(dto)
      return fund
     }
 

}