import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IWallet, IWalletResponse, Wallet } from "../Entity/wallet/wallet.entity";
import { CustomerEntityRepository, NotificationsRepository, WalletRepository } from "../auth/auth.repository";
import { CustomerEntity } from "../Entity/Users/customer.entity";
import { CreateWalletDto } from "./wallet.dto";
import * as bcrypt from 'bcrypt';
import { Notifications } from "../Entity/Notification/notification.entity";

@Injectable()
export class CustomerWalletService{
    constructor(@InjectRepository(Wallet) private readonly walletripo:WalletRepository,
    @InjectRepository(CustomerEntity)private readonly customerripository:CustomerEntityRepository,
    @InjectRepository(Notifications)
    private notificationrepository: NotificationsRepository,){}

    async hashpin(pin: string): Promise<string> {
        return await bcrypt.hash(pin, 20);
      }

    async createWallet(customerid:string,walletdto:CreateWalletDto):Promise<IWalletResponse>{
        try {
            const customer = await this.customerripository.findOne({where:{id:customerid}})
            if (!customer) throw new HttpException('this customer is not found',HttpStatus.NOT_FOUND)

            const hasWallet = await this.walletripo.createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.owner','owner')
            .where('owner.id = :customerid',{customerid:customer.id} )
            .getOne()

            if (hasWallet) throw new HttpException('you alrready have a wallet, you cannot create another wallet, you would have to delete the one you have first',HttpStatus.NOT_ACCEPTABLE)

      
    
            const hashpin = await this.hashpin(walletdto.PIN)
            walletdto.PIN = hashpin

            const wallet =new Wallet()
            wallet.owner = customer
            wallet.cratedDate = new Date()
            wallet.PIN = hashpin
            await this.walletripo.save(wallet)
    
            const walletResponse :IWalletResponse ={
                walletid : wallet.walletid,
                balance :wallet.balance,
                cratedDate : wallet.cratedDate,
                owner :{
                    username: customer.username,
                    digital_photo :customer.digital_photo
                }
            }
            return walletResponse
        
        } catch (error) {
            throw error  
        }
    }

    

    async fetchMywallet(walletid:string,customerid:string):Promise<IWalletResponse>{
        try {
            const customer = await this.customerripository.findOne({where:{id:customerid}})
            if (!customer) throw new HttpException('this customer is not found',HttpStatus.NOT_FOUND)

            const findwallet = await this.walletripo.findOne({where:{walletid:walletid}})
            if (!findwallet) throw new HttpException('this walletId does not exist',HttpStatus.NOT_FOUND)

            return findwallet

            
        } catch (error) {
            throw error
            
        }

      
    }

    async deleteMyWallet(walletid:string,customerid:string):Promise<{message:string}>{
        try {
            const customer = await this.customerripository.findOne({where:{id:customerid}})
            if (!customer) throw new HttpException('this customer is not found',HttpStatus.NOT_FOUND)

            const findwallet = await this.walletripo.findOne({where:{walletid:walletid}})
            if (!findwallet) throw new HttpException('this walletId does not exist',HttpStatus.NOT_FOUND)

            await this.walletripo.remove(findwallet)
            return {message:`this wallet has been successfully deleted by ${customer.username} on ${new Date()}`}

        } catch (error) {
            throw error
            
        }
    }

}